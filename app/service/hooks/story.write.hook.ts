import {useRecoilValue, useResetRecoilState, useSetRecoilState} from 'recoil';
import {
  writingStoryState,
  postStoryKeyState,
  selectedStoryKeyState,
} from '../../recoils/content/story.recoil';
import {uploadState} from '../../recoils/ui/upload.recoil';
import {isModalOpening} from '../../recoils/ui/modal.recoil';
import {useAuthAxios} from './network.hook';
import {useUpdatePublisher} from './update.hook';
import {storyListUpdate} from '../../recoils/shared/cache.recoil';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';
import {useEffect} from 'react';
import {heroState} from '../../recoils/content/hero.recoil.ts';
import {useStoryHttpPayLoad} from './story.payload.hook.ts';
import {useAuthValidation} from './common/validation.hook';
import {useStoryValidation} from './story/story-validation.hook';
import {useErrorHandler} from './common/error-handler.hook';

export const useResetAllWritingStory = () => {
  const resetWritingStory = useResetRecoilState(writingStoryState);

  return () => {
    resetWritingStory();
  };
};

export const useSaveStory = (): [() => void] => {
  const navigation = useNavigation<BasicNavigationProps>();
  const editStoryKey = useRecoilValue(selectedStoryKeyState);
  const writingStory = useRecoilValue(writingStoryState);
  const setUploadState = useSetRecoilState(uploadState);
  const setStoryUploading = (value: boolean) =>
    setUploadState(prev => ({...prev, story: value}));

  const publishStoryListUpdate = useUpdatePublisher(storyListUpdate);
  const resetAllWritingStory = useResetAllWritingStory();
  const storyHttpPayLoad = useStoryHttpPayLoad();
  const hero = useRecoilValue(heroState);

  const setModalOpen = useSetRecoilState(isModalOpening);
  const setPostStoryKey = useSetRecoilState(postStoryKeyState);

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
  const uploadStateValue = useRecoilValue(uploadState);
  return uploadStateValue.story;
};
