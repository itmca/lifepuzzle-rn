import { useCallback, useEffect } from 'react';
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
import { GalleryType } from '../../types/core/media.type';
import { queryKeys } from '../core/query-keys';
import { logger } from '../../utils/logger.util';
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
  const { selectedStoryKey: editStoryKey, writingStory } = useStoryStore();
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

/**
 * StoryDetailPage에서 inline editing으로 story를 저장하는 mutation hook
 *
 * useSaveStory와의 차이점:
 * - useSaveStory: writingStory store 사용, navigation.goBack(), modal 표시
 * - useStoryDetailMutation: 파라미터로 galleryItem 받음, 같은 페이지 유지, onSuccess/onError callback 제공
 *
 * @example
 * const { saveTrigger, isSaving } = useStoryDetailMutation({
 *   galleryItem: currentGalleryItem,
 *   onSuccess: (storyKey) => {
 *     // StoryDetailPage에서 updatedStory 생성 및 store 업데이트
 *     const updatedStory = createUpdatedStory(storyKey, content, currentGalleryItem);
 *     updateGalleryStory(currentGalleryItem.id, updatedStory);
 *     showToast('이야기가 저장되었습니다');
 *     setIsEditing(false);
 *   },
 *   onError: (message) => showErrorToast(message),
 * });
 *
 * const handleSave = () => {
 *   if (isContentEmpty) return;
 *   saveTrigger(content);
 * };
 */

type UseStoryDetailMutationParams = {
  galleryItem: GalleryType | undefined;
  onSuccess: (storyKey: string) => void;
  onError: (message: string) => void;
};

export type UseStoryDetailMutationReturn = {
  saveTrigger: (content: string) => void;
  isSaving: boolean;
};

export const useStoryDetailMutation = ({
  galleryItem,
  onSuccess,
  onError,
}: UseStoryDetailMutationParams): UseStoryDetailMutationReturn => {
  const { currentHero } = useHeroStore();
  const queryClient = useQueryClient();
  const editStoryKey = galleryItem?.story?.id;

  const [isSaving, trigger] = useAuthMutation<{ storyKey: string }>({
    axiosConfig: {
      method: editStoryKey ? 'put' : 'post',
      url: editStoryKey
        ? `/v3/galleries/stories/${editStoryKey}`
        : '/v3/galleries/stories',
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30_000,
    },
    onSuccess: ({ storyKey }) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
      onSuccess(storyKey);
    },
    onError: () => {
      const errorMessage = editStoryKey
        ? '이야기 수정에 실패했습니다. 다시 시도해주세요.'
        : '이야기 저장에 실패했습니다. 다시 시도해주세요.';
      onError(errorMessage);
    },
  });

  const saveTrigger = useCallback(
    (content: string) => {
      // Validation
      if (!content.trim()) {
        onError('이야기 내용을 입력해주세요');
        return;
      }

      if (content.length > 1000) {
        onError('1000자 이내로 입력해주세요');
        return;
      }

      if (!currentHero) {
        onError('주인공 정보를 불러올 수 없습니다');
        return;
      }

      if (!galleryItem) {
        onError('사진 정보를 불러올 수 없습니다');
        return;
      }

      // WritingStoryType 객체 생성
      const writingStory = {
        content,
        date: galleryItem.date ?? new Date(),
        gallery: [
          {
            id: galleryItem.id,
            uri: galleryItem.url,
            tagKey: galleryItem.tag?.key ?? 'UNCATEGORIZED',
          },
        ],
        voice: galleryItem.story?.audios?.[0],
      };

      // FormData 생성 및 API 호출
      const formData = StoryPayloadService.createStoryFormData(
        writingStory,
        currentHero,
      );

      void trigger({ data: formData });
    },
    [currentHero, galleryItem, trigger, onError],
  );

  return { saveTrigger, isSaving };
};

/**
 * Story Content Upsert API를 사용하여 텍스트 내용만 저장하는 mutation hook
 *
 * @example
 * const { saveContent, isSaving } = useStoryContentUpsert({
 *   onSuccess: (storyKey) => {
 *     updateGalleryStory(galleryId, updatedStory);
 *     showToast('이야기가 저장되었습니다');
 *   },
 *   onError: (message) => showErrorToast(message),
 * });
 *
 * const handleSave = () => {
 *   saveContent(heroId, galleryId, content);
 * };
 */

type UseStoryContentUpsertParams = {
  onSuccess: (storyKey: string) => void;
  onError: (message: string) => void;
};

export type UseStoryContentUpsertReturn = {
  saveContent: (heroId: number, galleryId: number, content: string) => void;
  isSaving: boolean;
};

export const useStoryContentUpsert = ({
  onSuccess,
  onError,
}: UseStoryContentUpsertParams): UseStoryContentUpsertReturn => {
  const queryClient = useQueryClient();

  const [isSaving, trigger] = useAuthMutation<{ storyKey: string }>({
    axiosConfig: {
      method: 'post',
      url: '/v3/stories/content',
      headers: { 'Content-Type': 'application/json' },
    },
    onSuccess: ({ storyKey }) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
      onSuccess(storyKey);
    },
    onError: () => {
      onError('이야기 저장에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const saveContent = useCallback(
    (heroId: number, galleryId: number, content: string) => {
      // Validation
      if (!content.trim()) {
        onError('이야기 내용을 입력해주세요');
        return;
      }

      if (content.length > 1000) {
        onError('1000자 이내로 입력해주세요');
        return;
      }

      void trigger({
        data: {
          heroId,
          galleryId,
          content,
        },
      });
    },
    [trigger, onError],
  );

  return { saveContent, isSaving };
};

/**
 * Story Voice Upsert API를 사용하여 음성 파일을 저장하는 mutation hook
 *
 * @example
 * const { saveVoice, isSaving } = useStoryVoiceUpsert({
 *   onSuccess: () => {
 *     updateGalleryStory(galleryId, updatedStory);
 *     showToast('음성이 저장되었습니다');
 *   },
 *   onError: (message) => showErrorToast(message),
 * });
 *
 * const handleSave = () => {
 *   saveVoice(heroId, galleryId, voiceUri);
 * };
 */

type UseStoryVoiceUpsertParams = {
  onSuccess: () => void;
  onError: (message: string) => void;
};

export type UseStoryVoiceUpsertReturn = {
  saveVoice: (heroId: number, galleryId: number, voiceUri: string) => void;
  isSaving: boolean;
};

export const useStoryVoiceUpsert = ({
  onSuccess,
  onError,
}: UseStoryVoiceUpsertParams): UseStoryVoiceUpsertReturn => {
  const queryClient = useQueryClient();

  const [isSaving, trigger] = useAuthMutation<void>({
    axiosConfig: {
      method: 'post',
      url: '/v3/stories/voice',
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30_000,
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all });
      onSuccess();
    },
    onError: () => {
      onError('음성 저장에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const saveVoice = useCallback(
    (heroId: number, galleryId: number, voiceUri: string) => {
      // Validation
      if (!voiceUri) {
        onError('음성 파일을 선택해주세요');
        return;
      }

      // FormData 생성
      const formData = new FormData();

      // meta JSON 추가 (React Native FormData는 JSON을 string으로 append)
      const metaJson = JSON.stringify({
        heroId,
        galleryId,
      });
      formData.append('meta', metaJson);

      // voice 파일 추가
      const fileName = voiceUri.split('/').pop() || 'voice.m4a';
      const mimeType = voiceUri.endsWith('.mp4') ? 'audio/mp4' : 'audio/x-m4a';

      formData.append('voice', {
        uri: voiceUri,
        type: mimeType,
        name: fileName,
      } as any);

      void trigger({ data: formData });
    },
    [trigger, onError],
  );

  return { saveVoice, isSaving };
};
