import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useStoryStore } from '../../stores/story.store';
import { useUIStore } from '../../stores/ui.store';
import { useHeroStore } from '../../stores/hero.store';
import { useMediaStore } from '../../stores/media.store';
import { useSelectionStore } from '../../stores/selection.store';
import { useAuthMutation } from '../core/auth-mutation.hook';
import { useUpdatePublisher } from '../common/cache-observer.hook';
import { BasicNavigationProps } from '../../navigation/types';
import { StoryPayloadService } from './story-payload.service';
import { useAuthValidation } from '../auth/validation.hook';
import { useStoryValidation } from './story-validation.hook';
import { useErrorHandler } from '../common/error-handler.hook';
import { StoryType } from '../../types/core/story.type';
import { queryKeys } from '../core/query-keys';
import logger from '../../utils/logger.util';

export const useResetAllWritingStory = () => {
  const { resetWritingStory } = useStoryStore();
  return resetWritingStory;
};

export type UseSaveStoryReturn = {
  saveStory: () => void;
  isPending: boolean;
};

export const useSaveStory = (): UseSaveStoryReturn => {
  const navigation = useNavigation<BasicNavigationProps>();
  const queryClient = useQueryClient();
  const {
    selectedStoryKey: editStoryKey,
    writingStory,
    setPostStoryKey,
  } = useStoryStore();
  const setModalOpen = useUIStore(state => state.setModalOpen);
  const setStoryUploading = useUIStore(state => state.setStoryUploading);
  const { currentHero: hero } = useHeroStore();
  const updateGalleryStory = useMediaStore.getState().updateGalleryStory;

  const publishStoryListUpdate = useUpdatePublisher('storyListUpdate');
  const resetAllWritingStory = useResetAllWritingStory();
  const storyHttpPayLoad = hero
    ? StoryPayloadService.createStoryFormData(writingStory, hero)
    : null;

  const { validateLogin } = useAuthValidation();
  const { validateStoryContent } = useStoryValidation();
  const { showSimpleAlert } = useErrorHandler();

  const updateGalleryWithStory = (storyKey?: string) => {
    const targetGalleryId = writingStory.gallery?.[0]?.id;
    if (!targetGalleryId) {
      return;
    }

    const mediaState = useMediaStore.getState();
    const targetGallery = mediaState.gallery.find(
      item => item.id === targetGalleryId,
    );

    const baseStory = targetGallery?.story;
    const storyId = storyKey || editStoryKey || baseStory?.id || '';
    if (!storyId) {
      return;
    }

    const updatedStory: StoryType = {
      id: storyId,
      heroId: hero?.id ?? baseStory?.heroId ?? 0,
      title: writingStory.title ?? baseStory?.title ?? '',
      content: writingStory.content ?? baseStory?.content ?? '',
      question: baseStory?.question ?? '',
      photos: baseStory?.photos ?? [],
      audios: writingStory.voice
        ? [writingStory.voice]
        : (baseStory?.audios ?? []),
      videos: baseStory?.videos ?? [],
      gallery: baseStory?.gallery ?? [],
      tags: baseStory?.tags ?? [],
      date: writingStory.date ?? baseStory?.date ?? new Date(),
      createdAt: baseStory?.createdAt ?? new Date(),
      recordingTime: baseStory?.recordingTime,
      playingTime: baseStory?.playingTime,
    };

    updateGalleryStory(targetGalleryId, updatedStory);
  };

  const [isPending, trigger] = useAuthMutation<any>({
    axiosConfig: {
      method: editStoryKey ? 'put' : 'post',
      url: editStoryKey
        ? `/v3/galleries/stories/${editStoryKey}`
        : '/v3/galleries/stories',
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30_000,
    },
    onSuccess: ({ storyKey }) => {
      if (!editStoryKey) {
        setPostStoryKey(storyKey);
        setModalOpen(true);
      }

      updateGalleryWithStory(storyKey);
      resetAllWritingStory();
      publishStoryListUpdate();

      navigation.goBack();
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
    },
    onError: () => {
      const errorMessage = editStoryKey
        ? '이야기 수정에 실패했습니다. 재시도 부탁드립니다.'
        : '이야기 등록에 실패했습니다. 재시도 부탁드립니다.';
      showSimpleAlert(errorMessage);
    },
  });

  useEffect(() => {
    setStoryUploading(isPending);
  }, [isPending, setStoryUploading]);

  const submit = function () {
    if (!storyHttpPayLoad) {
      showSimpleAlert('스토리를 저장할 수 없습니다. 주인공 정보가 없습니다.');
      return;
    }

    void trigger({
      data: storyHttpPayLoad,
    });
  };

  function validate(): boolean {
    return validateStoryContent(writingStory) && validateLogin(navigation);
  }

  return {
    saveStory: () => {
      if (!validate()) {
        return;
      }
      submit();
    },
    isPending,
  };
};

export const useIsStoryUploading = (): boolean => {
  return useUIStore(state => state.isStoryUploading);
};

type UseDeleteStoryProps = {
  storyKey: string;
  galleryId?: number;
};

export type UseDeleteStoryReturn = {
  deleteStory: () => void;
  isPending: boolean;
};

export const useDeleteStory = ({
  storyKey,
  galleryId,
}: UseDeleteStoryProps): UseDeleteStoryReturn => {
  const queryClient = useQueryClient();
  const setStoryUploading = useUIStore(state => state.setStoryUploading);
  const publishStoryListUpdate = useUpdatePublisher('storyListUpdate');
  const { updateGalleryStory } = useMediaStore.getState();
  const { setOpenDetailBottomSheet } = useUIStore.getState();

  const [isPending, trigger] = useAuthMutation<void>({
    axiosConfig: {
      method: 'DELETE',
      url: `/v1/galleries/stories/${storyKey}`,
    },
    onSuccess: () => {
      if (galleryId) {
        updateGalleryStory(galleryId, null);
      }
      publishStoryListUpdate();
      setOpenDetailBottomSheet(false);
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
    },
    onError: err => {
      logger.error('Failed to delete story', {
        error: err,
        storyKey,
        galleryId,
      });
      Alert.alert('스토리 삭제를 실패했습니다. 재시도 부탁드립니다.');
    },
  });

  useEffect(() => {
    setStoryUploading(isPending);
  }, [isPending, setStoryUploading]);

  const submit = function () {
    void trigger({
      data: {
        storyKey: storyKey,
      },
    });
  };

  return {
    deleteStory: submit,
    isPending,
  };
};

type UseDeleteGalleryProps = {
  galleryId: number;
};

export type UseDeleteGalleryReturn = {
  deleteGallery: () => void;
  isPending: boolean;
};

export const useDeleteGallery = ({
  galleryId,
}: UseDeleteGalleryProps): UseDeleteGalleryReturn => {
  const queryClient = useQueryClient();
  const setStoryUploading = useUIStore(state => state.setStoryUploading);
  const selectionStore = useSelectionStore.getState();
  const { setOpenDetailBottomSheet } = useUIStore.getState();

  const [isPending, trigger] = useAuthMutation<void>({
    axiosConfig: {
      method: 'DELETE',
      url: `/v1/galleries/${galleryId}`,
    },
    onSuccess: () => {
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
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
    },
    onError: err => {
      logger.error('Failed to delete gallery', { error: err, galleryId });
      Alert.alert('사진 삭제를 실패했습니다. 재시도 부탁드립니다.');
    },
  });

  useEffect(() => {
    setStoryUploading(isPending);
  }, [isPending, setStoryUploading]);

  const submit = function () {
    void trigger({
      data: {
        galleryId: galleryId,
      },
    });
  };

  return {
    deleteGallery: submit,
    isPending,
  };
};
