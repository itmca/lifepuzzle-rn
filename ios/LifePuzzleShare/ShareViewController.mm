#import <UIKit/UIKit.h>
#import <Social/Social.h>
#import <MobileCoreServices/MobileCoreServices.h>
#import <UniformTypeIdentifiers/UniformTypeIdentifiers.h>

@interface ShareViewController : SLComposeServiceViewController
@end

@implementation ShareViewController

- (void)viewDidLoad {
    [super viewDidLoad];
}

- (BOOL)isContentValid {
    return YES;
}

- (void)didSelectPost {
    [self handleSharedContent];
}

- (void)handleSharedContent {
    NSExtensionContext *extensionContext = self.extensionContext;
    if (!extensionContext) {
        [self completeRequest];
        return;
    }
    
    NSArray<NSExtensionItem *> *inputItems = extensionContext.inputItems;
    NSMutableArray<NSItemProvider *> *attachments = [[NSMutableArray alloc] init];
    
    for (NSExtensionItem *item in inputItems) {
        if (item.attachments) {
            [attachments addObjectsFromArray:item.attachments];
        }
    }
    
    NSMutableArray<NSItemProvider *> *imageAttachments = [[NSMutableArray alloc] init];
    
    for (NSItemProvider *attachment in attachments) {
        if ([attachment hasItemConformingToTypeIdentifier:UTTypeImage.identifier]) {
            [imageAttachments addObject:attachment];
        }
    }
    
    if ([imageAttachments count] == 0) {
        [self completeRequest];
        return;
    }
    
    if ([imageAttachments count] == 1) {
        // Single image
        [self processImageAttachment:imageAttachments[0] completion:^(NSString * _Nullable uri) {
            if (uri) {
                [self saveSharedDataToUserDefaults:@"single" uri:uri uriList:nil];
            }
            [self openMainApp];
        }];
    } else {
        // Multiple images
        [self processMultipleImageAttachments:imageAttachments completion:^(NSArray<NSString *> * _Nonnull uris) {
            if ([uris count] > 0) {
                [self saveSharedDataToUserDefaults:@"multiple" uri:uris.firstObject uriList:uris];
            }
            [self openMainApp];
        }];
    }
}

- (void)processImageAttachment:(NSItemProvider *)attachment completion:(void (^)(NSString * _Nullable))completion {
    [attachment loadItemForTypeIdentifier:UTTypeImage.identifier options:nil completionHandler:^(id<NSSecureCoding>  _Nullable item, NSError * _Null_unspecified error) {
        dispatch_async(dispatch_get_main_queue(), ^{
            if (error || !item) {
                completion(nil);
                return;
            }
            
            NSURL *url = (NSURL *)item;
            if (![url isKindOfClass:[NSURL class]]) {
                completion(nil);
                return;
            }
            
            NSString *savedUri = [self copyImageToTempDirectoryFromURL:url];
            completion(savedUri);
        });
    }];
}

- (void)processMultipleImageAttachments:(NSArray<NSItemProvider *> *)attachments completion:(void (^)(NSArray<NSString *> *))completion {
    dispatch_group_t group = dispatch_group_create();
    NSMutableArray<NSString *> *savedUris = [[NSMutableArray alloc] init];
    
    for (NSItemProvider *attachment in attachments) {
        dispatch_group_enter(group);
        [self processImageAttachment:attachment completion:^(NSString * _Nullable uri) {
            if (uri) {
                @synchronized(savedUris) {
                    [savedUris addObject:uri];
                }
            }
            dispatch_group_leave(group);
        }];
    }
    
    dispatch_group_notify(group, dispatch_get_main_queue(), ^{
        completion([savedUris copy]);
    });
}

- (NSString *)copyImageToTempDirectoryFromURL:(NSURL *)sourceUrl {
    // Use App Groups container instead of temporary directory
    NSURL *containerUrl = [[NSFileManager defaultManager] containerURLForSecurityApplicationGroupIdentifier:@"group.io.itmca.lifepuzzle"];
    if (!containerUrl) {
        containerUrl = [NSFileManager defaultManager].temporaryDirectory;
    }
    
    // Create shared images directory if it doesn't exist
    NSURL *sharedImagesDir = [containerUrl URLByAppendingPathComponent:@"SharedImages"];
    NSError *dirError = nil;
    [[NSFileManager defaultManager] createDirectoryAtURL:sharedImagesDir withIntermediateDirectories:YES attributes:nil error:&dirError];
    
    NSString *fileName = [NSString stringWithFormat:@"shared_image_%@.jpg", [[NSUUID UUID] UUIDString]];
    NSURL *destinationUrl = [sharedImagesDir URLByAppendingPathComponent:fileName];
    
    NSData *imageData = nil;
    NSError *error = nil;
    
    BOOL didStartAccessing = [sourceUrl startAccessingSecurityScopedResource];
    @try {
        imageData = [NSData dataWithContentsOfURL:sourceUrl options:0 error:&error];
    } @finally {
        if (didStartAccessing) {
            [sourceUrl stopAccessingSecurityScopedResource];
        }
    }
    
    if (error || !imageData) {
        return nil;
    }
    
    BOOL success = [imageData writeToURL:destinationUrl options:NSDataWritingAtomic error:&error];
    if (!success || error) {
        return nil;
    }
    
    // Clean up old shared images (older than 24 hours)
    [self cleanupOldSharedImages];
    
    return destinationUrl.absoluteString;
}

- (void)saveSharedDataToUserDefaults:(NSString *)type uri:(NSString *)uri uriList:(NSArray<NSString *> *)uriList {
    NSUserDefaults *groupUserDefaults = [[NSUserDefaults alloc] initWithSuiteName:@"group.io.itmca.lifepuzzle"];
    NSUserDefaults *standardUserDefaults = [NSUserDefaults standardUserDefaults];
    
    // 우선 Group UserDefaults에 저장 시도
    if (groupUserDefaults) {
        [groupUserDefaults setObject:type forKey:@"SharedDataType"];
        
        if (uri) {
            [groupUserDefaults setObject:uri forKey:@"SharedDataURI"];
        }
        
        if (uriList) {
            [groupUserDefaults setObject:uriList forKey:@"SharedDataURIList"];
        }
        
        [groupUserDefaults synchronize];
    }
    
    // Standard UserDefaults에도 백업으로 저장
    [standardUserDefaults setObject:type forKey:@"SharedDataType"];
    
    if (uri) {
        [standardUserDefaults setObject:uri forKey:@"SharedDataURI"];
    }
    
    if (uriList) {
        [standardUserDefaults setObject:uriList forKey:@"SharedDataURIList"];
    }
    
    [standardUserDefaults synchronize];
}

- (void)openMainApp {
    NSURL *url = [NSURL URLWithString:@"lifepuzzle://shared"];
    
    UIResponder *responder = self;
    SEL selector = sel_registerName("openURL:");
    
    while (responder) {
        if ([responder respondsToSelector:selector] && responder != self) {
            [responder performSelector:selector withObject:url];
            break;
        }
        responder = [responder nextResponder];
    }
    
    [self completeRequest];
}

- (void)completeRequest {
    [self.extensionContext completeRequestReturningItems:@[] completionHandler:nil];
}

- (NSArray *)configurationItems {
    return @[];
}

- (void)cleanupOldSharedImages {
    NSURL *containerUrl = [[NSFileManager defaultManager] containerURLForSecurityApplicationGroupIdentifier:@"group.io.itmca.lifepuzzle"];
    if (!containerUrl) {
        return;
    }
    
    NSURL *sharedImagesDir = [containerUrl URLByAppendingPathComponent:@"SharedImages"];
    NSError *error = nil;
    NSArray<NSURL *> *files = [[NSFileManager defaultManager] contentsOfDirectoryAtURL:sharedImagesDir
                                                            includingPropertiesForKeys:@[NSURLCreationDateKey]
                                                                               options:NSDirectoryEnumerationSkipsHiddenFiles
                                                                                 error:&error];
    
    if (error || !files) {
        return;
    }
    
    NSTimeInterval dayAgo = -24 * 60 * 60; // 24 hours ago
    NSDate *cutoffDate = [[NSDate date] dateByAddingTimeInterval:dayAgo];
    
    for (NSURL *fileURL in files) {
        NSError *attributeError = nil;
        NSDictionary *attributes = [fileURL resourceValuesForKeys:@[NSURLCreationDateKey] error:&attributeError];
        
        if (attributeError || !attributes) {
            continue;
        }
        
        NSDate *creationDate = attributes[NSURLCreationDateKey];
        if (creationDate && [creationDate compare:cutoffDate] == NSOrderedAscending) {
            NSError *deleteError = nil;
            [[NSFileManager defaultManager] removeItemAtURL:fileURL error:&deleteError];
        }
    }
}

@end
