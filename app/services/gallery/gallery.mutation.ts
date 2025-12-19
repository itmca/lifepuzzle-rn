import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { BasicNavigationProps } from '../../navigation/types';
import { useHeroStore } from '../../stores/hero.store';
import { useSelectionStore } from '../../stores/selection.store';
import { useUIStore } from '../../stores/ui.store';
import { CustomAlert } from '../../components/ui/feedback/CustomAlert';
import { showErrorToast } from '../../components/ui/feedback/Toast';
import { imageConversionUtil } from '../../utils/image-conversion.util';
import { AgeType } from '../../types/core/media.type';
import {
  FileUploadDto,
  galleryApiService,
  PresignedUrlDto,
} from './gallery.api.service';
import { useAuthMutation } from '../core/auth-mutation.hook';
import { useUpdatePublisher } from '../common/cache-observer.hook';
import { queryKeys } from '../core/query-keys';
import { logger } from '../../utils/logger.util';
import {
  CONCURRENT_UPLOADS,
  IMAGE_CONVERSION_OPTIONS,
  UploadItem,
  UploadProgress,
  UploadRequest,
  UseUploadGalleryV2Options,
} from './gallery-upload-types';
import {
  calculateProgress,
  createInitialUploadItems,
  getReadyForUploadItems,
  getSuccessfulItems,
} from './gallery-upload-helpers.util';

// Re-export types for external use
export type { UploadRequest, UploadProgress } from './gallery-upload-types';

export type UseUploadGalleryReturn = {
  uploadGallery: () => void;
  isUploading: boolean;
  progress: UploadProgress;
};

export const useUploadGallery = (
  options?: UseUploadGalleryV2Options,
): UseUploadGalleryReturn => {
  const navigation = useNavigation<BasicNavigationProps>();
  const queryClient = useQueryClient();

  const currentHero = useHeroStore(state => state.currentHero);
  const storeSelectedTag = useSelectionStore(state => state.selectedTag);
  const storeSelectedGalleryItems = useSelectionStore(
    state => state.selectedGalleryItems,
  );
  const setSelectedGalleryItems = useSelectionStore(
    state => state.setSelectedGalleryItems,
  );
  const isUploading = useUIStore(state => state.isGalleryUploading);
  const setGalleryUploading = useUIStore(state => state.setGalleryUploading);

  const resetSelectedGalleryItems = () => setSelectedGalleryItems([]);
  const setIsUploading = (value: boolean) => setGalleryUploading(value);
  const publishStoryListUpdate = useUpdatePublisher('storyListUpdate');

  const { heroNo, selectedTag, selectedGalleryItems } = options?.request
    ? {
        heroNo: options?.request.heroNo,
        selectedTag: options?.request.selectedTag,
        selectedGalleryItems: options?.request?.selectedGalleryItems,
      }
    : {
        heroNo: currentHero?.id,
        selectedTag: storeSelectedTag,
        selectedGalleryItems: storeSelectedGalleryItems,
      };

  const [, setUploadItems] = useState<UploadItem[]>([]);
  const [progress, setProgress] = useState<UploadProgress>({
    total: 0,
    completed: 0,
    converting: 0,
    uploading: 0,
    failed: 0,
  });

  const [, requestPresignedUrls] = useAuthMutation<{
    presignedUrls: PresignedUrlDto[];
  }>({
    axiosConfig: {
      method: 'post',
      url: '/v1/galleries/presigned-urls',
    },
    onSuccess: response => {
      handlePresignedUrlsReceived(response.presignedUrls);
    },
    onError: err => {
      logger.error('Failed to request presigned URLs', { error: err });
      Alert.alert('업로드 준비에 실패했습니다. 재시도 부탁드립니다.');
      resetUpload();
    },
  });

  const [, completeUpload] = useAuthMutation<void>({
    axiosConfig: {
      method: 'post',
      url: '/v1/galleries/upload-complete',
    },
    onSuccess: () => {
      if (!options?.request) {
        resetSelectedGalleryItems();
        CustomAlert.simpleAlert('업로드 되었습니다.');
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
      } else {
        CustomAlert.simpleAlert('추가 되었습니다.');
        options.onClose && options.onClose();
      }
      publishStoryListUpdate();
      resetUpload();
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
    },
    onError: err => {
      logger.error('Failed to complete upload', { error: err });
      Alert.alert('업로드 완료 처리에 실패했습니다. 재시도 부탁드립니다.');
      resetUpload();
    },
  });

  const resetUpload = () => {
    setIsUploading(false);
    setUploadItems([]);
    setProgress({
      total: 0,
      completed: 0,
      converting: 0,
      uploading: 0,
      failed: 0,
    });
  };

  const updateProgress = (items: UploadItem[]) => {
    setProgress(calculateProgress(items));
  };

  const handlePresignedUrlsReceived = (presignedUrls: PresignedUrlDto[]) => {
    setUploadItems(currentItems => {
      const successfulItems = getSuccessfulItems(currentItems);

      const updatedItems = currentItems.map(item => {
        const successfulIndex = successfulItems.findIndex(
          successfulItem =>
            successfulItem.originalImage.node.image.uri ===
            item.originalImage.node.image.uri,
        );

        if (successfulIndex !== -1) {
          return {
            ...item,
            fileKey: presignedUrls[successfulIndex]?.fileKey,
            presignedUrl: presignedUrls[successfulIndex]?.url,
            uploadHeaders: presignedUrls[successfulIndex]?.headers,
          };
        }

        return item;
      });

      startUploadOnly(updatedItems);
      return updatedItems;
    });
  };

  const startImageConversionFirst = async (items: UploadItem[]) => {
    const semaphore = new Array(CONCURRENT_UPLOADS).fill(null);
    let currentIndex = 0;

    const processNextItem = async () => {
      while (currentIndex < items.length) {
        const itemIndex = currentIndex++;
        const item = items[itemIndex];

        try {
          setUploadItems(currentItems => {
            const updated = [...currentItems];
            updated[itemIndex] = {
              ...updated[itemIndex],
              uploadStatus: 'converting',
            };
            updateProgress(updated);
            return updated;
          });

          const convertedResult = await imageConversionUtil.optimizeImage(
            item.originalImage.node.image.uri,
            item.originalImage.node.image.filename || `image_${Date.now()}`,
            IMAGE_CONVERSION_OPTIONS,
          );

          setUploadItems(currentItems => {
            const updated = [...currentItems];
            updated[itemIndex] = {
              ...updated[itemIndex],
              convertedUri: convertedResult.uri,
              fileName: convertedResult.fileName,
              uploadStatus: 'pending',
            };
            updateProgress(updated);
            return updated;
          });
        } catch (error) {
          logger.error('Failed to convert image', {
            error,
            imageUri: item.originalImage.node.image.uri,
          });
          setUploadItems(currentItems => {
            const updated = [...currentItems];
            updated[itemIndex] = {
              ...updated[itemIndex],
              uploadStatus: 'failed',
              error:
                error instanceof Error ? error.message : 'Conversion failed',
            };
            updateProgress(updated);
            return updated;
          });
        }
      }
    };

    await Promise.all(semaphore.map(() => processNextItem()));

    setUploadItems(currentItems => {
      const successfulItems = getSuccessfulItems(currentItems);
      const failedCount = currentItems.filter(
        item => item.uploadStatus === 'failed',
      ).length;

      if (failedCount > 0) {
        Alert.alert(
          '일부 이미지 변환 실패',
          `${currentItems.length}개 중 ${failedCount}개 이미지 변환에 실패했습니다. 성공한 이미지만 업로드하시겠습니까?`,
          [
            { text: '취소', style: 'cancel', onPress: resetUpload },
            {
              text: '계속',
              onPress: () =>
                requestPresignedUrlsForSuccessfulItems(successfulItems),
            },
          ],
        );
      } else if (successfulItems.length > 0) {
        requestPresignedUrlsForSuccessfulItems(successfulItems);
      } else {
        Alert.alert('모든 이미지 변환에 실패했습니다. 다시 시도해주세요.');
        resetUpload();
      }

      return currentItems;
    });
  };

  const startUploadOnly = async (items: UploadItem[]) => {
    const readyItems = getReadyForUploadItems(items);

    if (readyItems.length === 0) {
      return;
    }

    const semaphore = new Array(CONCURRENT_UPLOADS).fill(null);
    let currentIndex = 0;

    const processNextItem = async () => {
      while (currentIndex < readyItems.length) {
        const currentItem = readyItems[currentIndex++];
        const itemIndex = items.findIndex(
          item =>
            item.originalImage.node.image.uri ===
            currentItem.originalImage.node.image.uri,
        );

        if (itemIndex === -1) {
          continue;
        }

        try {
          setUploadItems(currentItems => {
            const updated = [...currentItems];
            updated[itemIndex] = {
              ...updated[itemIndex],
              uploadStatus: 'uploading',
            };
            updateProgress(updated);
            return updated;
          });

          const isValid = await imageConversionUtil.validateImage(
            currentItem.convertedUri!,
          );
          if (!isValid) {
            throw new Error('Converted image validation failed');
          }

          const uint8Array = await imageConversionUtil.readImageAsUint8Array(
            currentItem.convertedUri!,
          );

          await galleryApiService.uploadToPresignedUrl(
            currentItem.presignedUrl!,
            uint8Array,
            currentItem.uploadHeaders!,
          );

          setUploadItems(currentItems => {
            const updated = [...currentItems];
            updated[itemIndex] = {
              ...updated[itemIndex],
              uploadStatus: 'completed',
            };
            updateProgress(updated);
            return updated;
          });
        } catch (error) {
          logger.error('Failed to upload image', {
            error,
            fileKey: currentItem.fileKey,
            imageUri: currentItem.originalImage.node.image.uri,
          });
          setUploadItems(currentItems => {
            const updated = [...currentItems];
            updated[itemIndex] = {
              ...updated[itemIndex],
              uploadStatus: 'failed',
              error: error instanceof Error ? error.message : 'Upload failed',
            };
            updateProgress(updated);
            return updated;
          });
        }
      }
    };

    await Promise.all(semaphore.map(() => processNextItem()));

    setUploadItems(currentItems => {
      const completedItems = currentItems.filter(
        item => item.uploadStatus === 'completed',
      );
      const failedCount = currentItems.filter(
        item => item.uploadStatus === 'failed',
      ).length;

      if (failedCount > 0) {
        Alert.alert(
          '일부 이미지 업로드 실패',
          `${completedItems.length}개 완료, ${failedCount}개 실패했습니다. 재시도하시겠습니까?`,
          [
            { text: '취소', style: 'cancel', onPress: resetUpload },
            { text: '재시도', onPress: () => retryFailedUploads() },
          ],
        );
      } else if (completedItems.length > 0) {
        const fileKeys = completedItems
          .map(item => item.fileKey)
          .filter(Boolean) as string[];

        void completeUpload({ data: { fileKeys } });
      } else {
        Alert.alert('업로드할 이미지가 없습니다.');
        resetUpload();
      }

      return currentItems;
    });
  };

  const requestPresignedUrlsForSuccessfulItems = (
    successfulItems: UploadItem[],
  ) => {
    const files: FileUploadDto[] = successfulItems.map(item => ({
      fileName: item.fileName!,
      contentType: 'image/jpeg',
    }));

    void requestPresignedUrls({
      data: {
        heroId: heroNo,
        ageGroup: selectedTag?.key || '',
        files,
      },
    });
  };

  const retryFailedUploads = () => {
    setUploadItems(currentItems => {
      const updatedItems = currentItems.map(item =>
        item.uploadStatus === 'failed'
          ? { ...item, uploadStatus: 'pending' as const, error: undefined }
          : item,
      );

      const failedItems = updatedItems.filter(
        item => item.uploadStatus === 'pending',
      );
      if (failedItems.length > 0) {
        startImageConversionFirst(failedItems);
      }

      return updatedItems;
    });
  };

  const submit = () => {
    if (!selectedGalleryItems || selectedGalleryItems.length === 0) {
      Alert.alert('이미지를 선택해주세요.');
      return;
    }

    if (selectedGalleryItems.length > 30) {
      Alert.alert('최대 30개까지 선택할 수 있습니다.');
      return;
    }
    if (!options?.request) {
      setIsUploading(true);
    }
    const initialItems = createInitialUploadItems(selectedGalleryItems);
    setUploadItems(initialItems);
    startImageConversionFirst(initialItems);
  };

  return {
    uploadGallery: submit,
    isUploading,
    progress,
  };
};

interface AiPhotoCreateRequest {
  heroId: number;
  galleryId: number;
  drivingVideoId: number;
}

interface AiPhotoCreateResponse {
  videoId: string;
  status: 'pending' | 'processing' | 'completed';
}

export type UseCreateAiPhotoReturn = {
  createAiPhoto: () => void;
  createAiPhotoWithErrorHandling: () => Promise<boolean>;
  createAiPhotoWithParams: (params: AiPhotoCreateRequest) => void;
  isPending: boolean;
};

export const useCreateAiPhoto = (
  request: AiPhotoCreateRequest,
): UseCreateAiPhotoReturn => {
  const navigation = useNavigation<BasicNavigationProps>();
  const queryClient = useQueryClient();

  const [isPending, trigger] = useAuthMutation<AiPhotoCreateResponse>({
    axiosConfig: {
      method: 'post',
      url: '/v1/ai/videos',
      data: {
        heroId: request.heroId,
        galleryId: request.galleryId,
        drivingVideoId: request.drivingVideoId,
      },
    },
    onSuccess: () => {
      navigation.navigate('App', {
        screen: 'AiPhotoNavigator',
        params: {
          screen: 'AiPhotoWorkHistory',
        },
      });
      // 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.ai.galleries(request.heroId),
      });
    },
    onError: err => {
      logger.error('Failed to create AI photo', { error: err, request });
      showErrorToast('AI 포토 생성을 실패했습니다. 재시도 부탁드립니다.');
    },
  });

  const validate = (params: AiPhotoCreateRequest): boolean => {
    if (!params.drivingVideoId) {
      showErrorToast('움직임을 선택해 주세요.');
      return false;
    }
    return true;
  };

  const submit = () => {
    if (validate(request)) {
      void trigger({
        data: {
          heroId: request.heroId,
          galleryId: request.galleryId,
          drivingVideoId: request.drivingVideoId,
        },
      });
    }
  };

  const submitWithErrorHandling = async (): Promise<boolean> => {
    if (!validate(request)) {
      return false;
    }

    try {
      await trigger({
        data: {
          heroId: request.heroId,
          galleryId: request.galleryId,
          drivingVideoId: request.drivingVideoId,
        },
      });

      navigation.navigate('App', {
        screen: 'AiPhotoNavigator',
        params: {
          screen: 'AiPhotoWorkHistory',
        },
      });

      return true;
    } catch (error) {
      logger.error('Failed to create AI photo with error handling', {
        error,
        request,
      });
      showErrorToast('AI 포토 생성을 실패했습니다. 재시도 부탁드립니다.');
      return false;
    }
  };

  const submitWithParams = (params: AiPhotoCreateRequest) => {
    if (validate(params)) {
      void trigger({
        data: {
          heroId: params.heroId,
          galleryId: params.galleryId,
          drivingVideoId: params.drivingVideoId,
        },
      });
    }
  };

  return {
    createAiPhoto: submit,
    createAiPhotoWithErrorHandling: submitWithErrorHandling,
    createAiPhotoWithParams: submitWithParams,
    isPending,
  };
};

/**
 * Gallery의 날짜와 나이대 업데이트 Hook
 */
export type UseUpdateGalleryDateAndAgeReturn = {
  updateDateAndAge: (
    galleryId: number,
    date: Date,
    ageGroup: AgeType,
  ) => Promise<void>;
  isPending: boolean;
};

export const useUpdateGalleryDateAndAge = (options?: {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}): UseUpdateGalleryDateAndAgeReturn => {
  const queryClient = useQueryClient();

  const [isPending, trigger] = useAuthMutation<void>({
    axiosConfig: {
      method: 'PATCH',
      url: '/v1/galleries/:id', // Placeholder URL
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
      options?.onSuccess?.();
    },
    onError: err => {
      logger.error('Failed to update gallery date and age', { error: err });
      options?.onError?.(
        '날짜 및 나이대 업데이트에 실패했습니다. 다시 시도해주세요.',
      );
    },
  });

  const updateDateAndAge = useCallback(
    async (galleryId: number, date: Date, ageGroup: AgeType) => {
      await trigger({
        url: `/v1/galleries/${galleryId}`,
        data: {
          date: date.toISOString(),
          ageGroup,
        },
      });
    },
    [trigger],
  );

  return {
    updateDateAndAge,
    isPending,
  };
};
