#import <React/RCTBridgeModule.h>
#import <ReactCommon/RCTTurboModule.h>
#import "../build/generated/ios/LPShareModuleSpec/LPShareModuleSpec.h"

@interface LPShareModule : NativeLPShareModuleSpecBase <NativeLPShareModuleSpec>
@end

@implementation LPShareModule

static NSString *sharedImageURI = nil;
static NSArray<NSString *> *sharedImageURIs = nil;

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

+ (void)setSharedURI:(NSString *)uri {
    sharedImageURI = uri;
}

+ (void)setSharedURIs:(NSArray<NSString *> *)uris {
    sharedImageURIs = uris;
}

+ (NSString *)getSharedURI {
    return sharedImageURI;
}

+ (NSArray<NSString *> *)getSharedURIs {
    return sharedImageURIs;
}

+ (void)clearSharedData {
    sharedImageURI = nil;
    sharedImageURIs = nil;
}

- (void)sendSharedData:(NSString *)eventName data:(NSString *)data {
    // iOS에서 이벤트 발송은 현재 구현하지 않음 (Android에서만 사용)
}

- (void)testMethod:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    NSUserDefaults *groupUserDefaults = [[NSUserDefaults alloc] initWithSuiteName:@"group.io.itmca.lifepuzzle"];
    NSUserDefaults *standardUserDefaults = [NSUserDefaults standardUserDefaults];
    
    NSMutableDictionary *debugInfo = [[NSMutableDictionary alloc] init];
    
    if (groupUserDefaults) {
        NSString *groupType = [groupUserDefaults stringForKey:@"SharedDataType"];
        NSString *groupURI = [groupUserDefaults stringForKey:@"SharedDataURI"];
        [debugInfo setObject:@{
            @"type": groupType ?: @"nil",
            @"uri": groupURI ?: @"nil"
        } forKey:@"groupUserDefaults"];
    } else {
        [debugInfo setObject:@"nil" forKey:@"groupUserDefaults"];
    }
    
    NSString *standardType = [standardUserDefaults stringForKey:@"SharedDataType"];
    NSString *standardURI = [standardUserDefaults stringForKey:@"SharedDataURI"];
    [debugInfo setObject:@{
        @"type": standardType ?: @"nil",
        @"uri": standardURI ?: @"nil"
    } forKey:@"standardUserDefaults"];
    
    [debugInfo setObject:@"ShareModule is working!" forKey:@"status"];
    resolve(debugInfo);
}

- (void)getSharedData:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    NSMutableDictionary *result = [[NSMutableDictionary alloc] init];
    
    NSUserDefaults *groupUserDefaults = [[NSUserDefaults alloc] initWithSuiteName:@"group.io.itmca.lifepuzzle"];
    NSUserDefaults *standardUserDefaults = [NSUserDefaults standardUserDefaults];
    
    // Group UserDefaults에서 먼저 확인
    NSString *sharedType = nil;
    NSString *sharedURI = nil;
    NSArray<NSString *> *sharedURIList = nil;
    NSString *sourceType = @"none";
    
    if (groupUserDefaults) {
        sharedType = [groupUserDefaults stringForKey:@"SharedDataType"];
        sharedURI = [groupUserDefaults stringForKey:@"SharedDataURI"];
        sharedURIList = [groupUserDefaults arrayForKey:@"SharedDataURIList"];
        
        if (sharedType) {
            sourceType = @"group";
        }
    }
    
    // Group UserDefaults에 데이터가 없으면 Standard UserDefaults 확인
    if (!sharedType && standardUserDefaults) {
        sharedType = [standardUserDefaults stringForKey:@"SharedDataType"];
        sharedURI = [standardUserDefaults stringForKey:@"SharedDataURI"];
        sharedURIList = [standardUserDefaults arrayForKey:@"SharedDataURIList"];
        
        if (sharedType) {
            sourceType = @"standard";
        }
    }
    
    
    if (sharedType && [sharedType length] > 0) {
        [result setObject:sharedType forKey:@"type"];
        
        if ([sharedType isEqualToString:@"single"] && sharedURI) {
            [result setObject:sharedURI forKey:@"uri"];
        } else if ([sharedType isEqualToString:@"multiple"] && sharedURIList && [sharedURIList count] > 0) {
            [result setObject:sharedURIList forKey:@"uriList"];
            [result setObject:[sharedURIList firstObject] forKey:@"uri"];
        }
        
        // 데이터 사용 후 삭제
        if ([sourceType isEqualToString:@"group"] && groupUserDefaults) {
            [groupUserDefaults removeObjectForKey:@"SharedDataType"];
            [groupUserDefaults removeObjectForKey:@"SharedDataURI"];
            [groupUserDefaults removeObjectForKey:@"SharedDataURIList"];
            [groupUserDefaults synchronize];
        } else if ([sourceType isEqualToString:@"standard"] && standardUserDefaults) {
            [standardUserDefaults removeObjectForKey:@"SharedDataType"];
            [standardUserDefaults removeObjectForKey:@"SharedDataURI"];
            [standardUserDefaults removeObjectForKey:@"SharedDataURIList"];
            [standardUserDefaults synchronize];
        }
        
    } else {
        // UserDefaults에 데이터가 없으면 기존 로직 사용
        NSString *legacySharedURI = [LPShareModule getSharedURI];
        NSArray<NSString *> *legacySharedURIs = [LPShareModule getSharedURIs];
        
        if (legacySharedURI != nil) {
            [result setObject:@"single" forKey:@"type"];
            [result setObject:legacySharedURI forKey:@"uri"];
            [LPShareModule clearSharedData];
        } else if (legacySharedURIs != nil && [legacySharedURIs count] > 0) {
            [result setObject:@"multiple" forKey:@"type"];
            [result setObject:legacySharedURIs forKey:@"uriList"];
            [result setObject:[legacySharedURIs firstObject] forKey:@"uri"];
            [LPShareModule clearSharedData];
        } else {
            [result setObject:[NSNull null] forKey:@"type"];
        }
    }
    
    resolve(result);
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeLPShareModuleSpecJSI>(params);
}

@end