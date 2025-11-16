import {useStoryStore} from '../../stores/story.store';
import {useUIStore} from '../../stores/ui.store';
import {useHeroStore} from '../../stores/hero.store';
import {useAuthAxios} from '../core/auth-http.hook';
import {useUpdatePublisher} from '../common/update.hook';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';
import {useEffect} from 'react';
import {StoryPayloadService} from './story-payload.service';
import {useAuthValidation} from '../auth/validation.hook';
import {useStoryValidation} from './story-validation.hook';
import {useErrorHandler} from '../common/error-handler.hook';

export const useResetAllWritingStory = () => {
  const {resetWritingStory} = useStoryStore();

  return resetWritingStory;
};

export const useSaveStory = (): [() => void] => {
  const navigation = useNavigation<BasicNavigationProps>();
  const {
    selectedStoryKey: editStoryKey,
    writingStory,
    setPostStoryKey,
  } = useStoryStore();
  const {setUploadState, setModalOpen} = useUIStore();
  const {currentHero: hero} = useHeroStore();
  const setStoryUploading = (value: boolean) => setUploadState({story: value});

  const publishStoryListUpdate = useUpdatePublisher('storyListUpdate');
  const resetAllWritingStory = useResetAllWritingStory();
  const storyHttpPayLoad = StoryPayloadService.createStoryFormData(
    writingStory,
    hero,
  );

  const {validateLogin} = useAuthValidation();
  const {validateStoryContent} = useStoryValidation();
  const {showSimpleAlert} = useErrorHandler();

  const [isLoading, saveStory] = useAuthAxios<any>({
    requestOption: {
      method: editStoryKey ? 'put' : 'post',
      url: editStoryKey
        ? `/v3/galleries/stories//${editStoryKey}`
        : '/v3/galleries/stories',
      headers: {'Content-Type': 'multipart/form-data'},
      timeout: 30_000, // speech to text 시 10~20초가 걸려 30초로 하며 관련 처리 시간 단축 시 timeout 조정 필요
    },
    onResponseSuccess: ({storyKey}) => {
      if (!editStoryKey) {
        setPostStoryKey(storyKey);
        setModalOpen(true);
      }

      resetAllWritingStory();
      publishStoryListUpdate();

      navigation.navigate('HomeTab', {screen: 'Home'});
    },
    onError: () => {
      const errorMessage = editStoryKey
        ? '퍼즐 수정에 실패했습니다. 재시도 부탁드립니다.'
        : '퍼즐 등록에 실패했습니다. 재시도 부탁드립니다.';
      showSimpleAlert(errorMessage);
    },
    disableInitialRequest: true,
  });

  useEffect(() => {
    setStoryUploading(isLoading);
  }, [isLoading]);

  const submit = function () {
    saveStory({
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
