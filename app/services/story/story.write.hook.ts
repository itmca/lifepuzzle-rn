import { useStoryStore } from '../../stores/story.store.ts';
import { useUIStore } from '../../stores/ui.store.ts';
import { useHeroStore } from '../../stores/hero.store.ts';
import { useAuthMutation } from '../core/auth-mutation.hook.ts';
import { useUpdatePublisher } from '../common/update.hook.ts';
import { useNavigation } from '@react-navigation/native';
import { BasicNavigationProps } from '../../navigation/types.tsx';
import { useEffect } from 'react';
import { StoryPayloadService } from './story-payload.service.ts';
import { useAuthValidation } from '../auth/validation.hook.ts';
import { useStoryValidation } from './story-validation.hook.ts';
import { useErrorHandler } from '../common/error-handler.hook.ts';
import { useMediaStore } from '../../stores/media.store.ts';
import { StoryType } from '../../types/core/story.type.ts';

export const useResetAllWritingStory = () => {
  const { resetWritingStory } = useStoryStore();

  return resetWritingStory;
};

export const useSaveStory = (): [() => void] => {
  const navigation = useNavigation<BasicNavigationProps>();
  const {
    selectedStoryKey: editStoryKey,
    writingStory,
    setPostStoryKey,
  } = useStoryStore();
  const { setUploadState, setModalOpen } = useUIStore();
  const { currentHero: hero } = useHeroStore();
  const setStoryUploading = (value: boolean) =>
    setUploadState({ story: value });
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

  const [isLoading, saveStory] = useAuthMutation<any>({
    axiosConfig: {
      method: editStoryKey ? 'put' : 'post',
      url: editStoryKey
        ? `/v3/galleries/stories/${editStoryKey}`
        : '/v3/galleries/stories',
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30_000, // speech to text 시 10~20초가 걸려 30초로 하며 관련 처리 시간 단축 시 timeout 조정 필요
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
    },
    onError: () => {
      const errorMessage = editStoryKey
        ? '이야기 수정에 실패했습니다. 재시도 부탁드립니다.'
        : '이야기 등록에 실패했습니다. 재시도 부탁드립니다.';
      showSimpleAlert(errorMessage);
    },
  });

  useEffect(() => {
    setStoryUploading(isLoading);
  }, [isLoading]);

  const submit = function () {
    if (!storyHttpPayLoad) {
      showSimpleAlert('스토리를 저장할 수 없습니다. 주인공 정보가 없습니다.');
      return;
    }

    void saveStory({
      data: storyHttpPayLoad,
    });
  };

  function validate(): boolean {
    return validateStoryContent(writingStory) && validateLogin(navigation);
  }

  return [
    () => {
      if (!validate()) {
        return;
      }

      submit();
    },
  ];
};

export const useIsStoryUploading = (): boolean => {
  const uploadState = useUIStore(state => state.uploadState);
  return uploadState.story;
};
