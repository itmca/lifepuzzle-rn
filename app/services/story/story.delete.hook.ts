import { useUIStore } from '../../stores/ui.store.ts';
import { useAuthAxios } from '../core/auth-http.hook.ts';
import { Alert } from 'react-native';
import { useUpdatePublisher } from '../common/update.hook.ts';
import { useEffect } from 'react';
import { useMediaStore } from '../../stores/media.store.ts';
import { useSelectionStore } from '../../stores/selection.store.ts';
import logger from '../../utils/logger.util';

type Props = {
  storyKey: string;
  galleryId?: number;
};
type GalleryProps = {
  galleryId: number;
};
export const useDeleteStory = ({
  storyKey,
  galleryId,
}: Props): [() => void] => {
  const setUploadState = useUIStore(state => state.setUploadState);
  const setStoryloading = (value: boolean) => setUploadState({ story: value });
  const publishStoryListUpdate = useUpdatePublisher('storyListUpdate');
  const { updateGalleryStory } = useMediaStore.getState();
  const { setOpenDetailBottomSheet } = useUIStore.getState();

  const [isLoading, deleteStory] = useAuthAxios<void>({
    requestOption: {
      method: 'DELETE',
      url: `/v1/galleries/stories/${storyKey}`,
    },
    onResponseSuccess: () => {
      if (galleryId) {
        updateGalleryStory(galleryId, null);
      }
      publishStoryListUpdate();
      setOpenDetailBottomSheet(false);
    },
    onError: err => {
      logger.error('Failed to delete story', {
        error: err,
        storyKey,
        galleryId,
      });
      Alert.alert('스토리 삭제를 실패했습니다. 재시도 부탁드립니다.');
    },
    disableInitialRequest: true,
  });

  useEffect(() => {
    setStoryloading(isLoading);
  }, [isLoading]);

  const submit = function () {
    deleteStory({
      data: {
        storyKey: storyKey,
      },
    });
  };

  return [
    () => {
      submit();
    },
  ];
};
export const useDeleteGallery = ({ galleryId }: GalleryProps): [() => void] => {
  const setUploadState = useUIStore(state => state.setUploadState);
  const setStoryloading = (value: boolean) => setUploadState({ story: value });
  const selectionStore = useSelectionStore.getState();
  const { setOpenDetailBottomSheet } = useUIStore.getState();

  const [isLoading, deleteStory] = useAuthAxios<void>({
    requestOption: {
      method: 'DELETE',
      url: `/v1/galleries/${galleryId}`,
    },
    onResponseSuccess: () => {
      const mediaState = useMediaStore.getState();
      const allGalleryBefore = mediaState.gallery;
      const filteredGalleryBefore = allGalleryBefore.filter(
        item => item.tag?.key !== 'AI_PHOTO',
      );
      const removedIndex = allGalleryBefore.findIndex(
        item => item.id === galleryId,
      );
      const removedFilteredIndex = filteredGalleryBefore.findIndex(
        item => item.id === galleryId,
      );

      mediaState.removeGalleryItem(galleryId);
      const { gallery: updatedGallery } = useMediaStore.getState();
      const filteredGallery = updatedGallery.filter(
        item => item.tag?.key !== 'AI_PHOTO',
      );

      if (filteredGallery.length === 0) {
        setOpenDetailBottomSheet(false);
        return;
      }

      // 필터링된 갤러리 기준으로 인덱스 계산
      // 1. 삭제된 아이템의 필터링된 인덱스를 기준으로 시작
      // 2. 범위를 벗어나면 마지막 인덱스로 조정
      // 3. 필터링된 갤러리의 해당 아이템을 찾아 전체 갤러리 인덱스로 변환
      let targetFilteredIndex =
        removedFilteredIndex >= 0
          ? removedFilteredIndex
          : filteredGallery.length - 1;
      if (targetFilteredIndex >= filteredGallery.length) {
        targetFilteredIndex = filteredGallery.length - 1;
      }
      const targetItem = filteredGallery[targetFilteredIndex];
      const nextIndex = updatedGallery.findIndex(
        item => item.id === targetItem.id,
      );
      const clampedIndex =
        nextIndex >= 0
          ? nextIndex
          : Math.max(Math.min(removedIndex, filteredGallery.length - 1), 0);

      selectionStore.setCurrentGalleryIndex(clampedIndex);

      setOpenDetailBottomSheet(false);
    },
    onError: err => {
      logger.error('Failed to delete gallery', { error: err, galleryId });
      Alert.alert('사진 삭제를 실패했습니다. 재시도 부탁드립니다.');
    },
    disableInitialRequest: true,
  });

  useEffect(() => {
    setStoryloading(isLoading);
  }, [isLoading]);

  const submit = function () {
    deleteStory({
      data: {
        galleryId: galleryId,
      },
    });
  };

  return [
    () => {
      submit();
    },
  ];
};
