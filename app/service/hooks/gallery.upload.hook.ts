import {useEffect, useState} from 'react';
import {useRecoilValue, useResetRecoilState, useSetRecoilState} from 'recoil';
import {useNavigation} from '@react-navigation/native';
import {Alert} from 'react-native';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';

import {BasicNavigationProps} from '../../navigation/types';
import {heroState} from '../../recoils/hero.recoil';
import {selectedTagState} from '../../recoils/photos.recoil';
import {
  isGalleryUploadingState,
  selectedGalleryItemsState,
} from '../../recoils/gallery-write.recoil';
import {TagType} from '../../types/photo.type';
import {CustomAlert} from '../../components/alert/CustomAlert';
import {imageConversionUtil} from '../../utils/image-conversion.util';
import {
  FileUploadDto,
  galleryApiService,
  PresignedUrlDto,
} from '../api/gallery.api.service';
import {useAuthAxios} from './network.hook';

interface UploadItem {
  originalImage: PhotoIdentifier;
  convertedUri?: string;
  fileName?: string;
  fileKey?: string;
  presignedUrl?: string;
  uploadHeaders?: Record<string, string>;
  uploadStatus: 'pending' | 'converting' | 'uploading' | 'completed' | 'failed';
  error?: string;
}

interface UploadProgress {
  total: number;
  completed: number;
  converting: number;
  uploading: number;
  failed: number;
}

const CONCURRENT_UPLOADS = 3;
const IMAGE_CONVERSION_OPTIONS = {
  quality: 80,
  maxWidth: 1920,
  maxHeight: 1080,
  format: 'JPEG' as const,
};

// Helper functions
const createInitialUploadItems = (items: PhotoIdentifier[]): UploadItem[] =>
  items.map(item => ({
    originalImage: item,
    uploadStatus: 'pending' as const,
  }));

const calculateProgress = (items: UploadItem[]): UploadProgress => ({
  total: items.length,
  completed: items.filter(item => item.uploadStatus === 'completed').length,
  converting: items.filter(item => item.uploadStatus === 'converting').length,
  uploading: items.filter(item => item.uploadStatus === 'uploading').length,
  failed: items.filter(item => item.uploadStatus === 'failed').length,
});

const getSuccessfulItems = (items: UploadItem[]): UploadItem[] =>
  items.filter(
    item =>
      item.uploadStatus === 'pending' && item.convertedUri && item.fileName,
  );

const getReadyForUploadItems = (items: UploadItem[]): UploadItem[] =>
  items.filter(
    item =>
      item.convertedUri &&
      item.presignedUrl &&
      item.uploadHeaders &&
      item.fileKey,
  );

export const useUploadGalleryV2 = (): [() => void, boolean, UploadProgress] => {
  const navigation = useNavigation<BasicNavigationProps>();

  const hero = useRecoilValue(heroState);
  const selectedTag = useRecoilValue<TagType>(selectedTagState);
  const selectedGalleryItems = useRecoilValue(selectedGalleryItemsState);
  const resetSelectedGalleryItems = useResetRecoilState(
    selectedGalleryItemsState,
  );
  const isUploading = useRecoilValue(isGalleryUploadingState);
  const setIsUploading = useSetRecoilState(isGalleryUploadingState);

  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
  const [progress, setProgress] = useState<UploadProgress>({
    total: 0,
    completed: 0,
    converting: 0,
    uploading: 0,
    failed: 0,
  });

  const [, requestPresignedUrls] = useAuthAxios<any>({
    requestOption: {
      method: 'post',
      url: '/v1/galleries/presigned-urls',
    },
    onResponseSuccess: (response: {presignedUrls: PresignedUrlDto[]}) => {
      handlePresignedUrlsReceived(response.presignedUrls);
    },
    onError: () => {
      Alert.alert('업로드 준비에 실패했습니다. 재시도 부탁드립니다.');
      resetUpload();
    },
    disableInitialRequest: true,
  });

  const [, completeUpload] = useAuthAxios<any>({
    requestOption: {
      method: 'post',
      url: '/v1/galleries/upload-complete',
    },
    onResponseSuccess: () => {
      resetSelectedGalleryItems();
      CustomAlert.simpleAlert('업로드 되었습니다.');
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
      resetUpload();
    },
    onError: () => {
      Alert.alert('업로드 완료 처리에 실패했습니다. 재시도 부탁드립니다.');
      resetUpload();
    },
    disableInitialRequest: true,
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
            {text: '취소', style: 'cancel', onPress: resetUpload},
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

        if (itemIndex === -1) continue;

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
            {text: '취소', style: 'cancel', onPress: resetUpload},
            {text: '재시도', onPress: () => retryFailedUploads()},
          ],
        );
      } else if (completedItems.length > 0) {
        const fileKeys = completedItems
          .map(item => item.fileKey)
          .filter(Boolean) as string[];

        completeUpload({data: {fileKeys}});
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

    requestPresignedUrls({
      data: {
        heroId: hero.heroNo,
        ageGroup: selectedTag.key,
        files,
      },
    });
  };

  const retryFailedUploads = () => {
    setUploadItems(currentItems => {
      const updatedItems = currentItems.map(item =>
        item.uploadStatus === 'failed'
          ? {...item, uploadStatus: 'pending' as const, error: undefined}
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
    if (selectedGalleryItems.length === 0) {
      Alert.alert('이미지를 선택해주세요.');
      return;
    }

    if (selectedGalleryItems.length > 30) {
      Alert.alert('최대 30개까지 선택할 수 있습니다.');
      return;
    }

    setIsUploading(true);
    const initialItems = createInitialUploadItems(selectedGalleryItems);
    setUploadItems(initialItems);
    startImageConversionFirst(initialItems);
  };

  return [submit, isUploading, progress];
};
