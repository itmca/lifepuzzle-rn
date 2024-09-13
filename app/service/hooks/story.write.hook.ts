import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import {
  isModalOpening,
  isStoryUploading,
  isVoiceToTextProcessing,
  PostStoryKeyState,
  writingStoryState,
} from '../../recoils/story-write.recoil';
import {useAuthAxios} from './network.hook';
import {Alert} from 'react-native';
import {useUpdatePublisher} from './update.hooks';
import {storyListUpdate} from '../../recoils/update.recoil';
import {useNavigation} from '@react-navigation/native';
import {isLoggedInState} from '../../recoils/auth.recoil';
import {useStoryHttpPayLoad, useVoiceHttpPayLoad} from './story.payload.hook';
import {BasicNavigationProps} from '../../navigation/types';
import {useEffect} from 'react';
import {SelectedStoryKeyState} from '../../recoils/story-view.recoil';

export const useResetAllWritingStory = () => {
  const resetWritingStory = useResetRecoilState(writingStoryState);

  return () => {
    resetWritingStory();
  };
};

export const useSaveStory = (): [() => void] => {
  const navigation = useNavigation<BasicNavigationProps>();
  const editStoryKey = useRecoilValue(SelectedStoryKeyState);
  const writingStory = useRecoilValue(writingStoryState);
  const setStoryUploading = useSetRecoilState(isStoryUploading);
  const isLoggedIn = useRecoilValue<boolean>(isLoggedInState);

  const publishStoryListUpdate = useUpdatePublisher(storyListUpdate);
  const resetAllWritingStory = useResetAllWritingStory();
  const storyHttpPayLoad = useStoryHttpPayLoad();

  const setModalOpen = useSetRecoilState(isModalOpening);
  const setPostStoryKey = useSetRecoilState(PostStoryKeyState);

  const [isLoading, saveStory] = useAuthAxios<any>({
    requestOption: {
      method: editStoryKey ? 'put' : 'post',
      url: editStoryKey ? `/story/${editStoryKey}` : '/story',
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

      if (editStoryKey) {
        console.log('글 수정 완료');
        navigation.goBack();
      }
    },
    onError: err => {
      console.log(err);
      editStoryKey
        ? Alert.alert('퍼즐 수정에 실패했습니다. 재시도 부탁드립니다.')
        : Alert.alert('퍼즐 등록에 실패했습니다. 재시도 부탁드립니다.');
    },
    disableInitialRequest: true,
  });

  useEffect(() => {
    setStoryUploading(isLoading);
  }, [isLoading]);

  const submit = function () {
    saveStory({data: storyHttpPayLoad});
  };

  function validate(): boolean {
    if (!writingStory?.title) {
      Alert.alert('제목을 입력해주세요.');
      return false;
    } else if (!isLoggedIn) {
      Alert.alert(
        '미로그인 시점에 작성한 이야기는 저장할 수 없습니다.',
        '',
        [
          {
            text: '로그인하러가기',
            style: 'default',
            onPress: () => {
              navigation.push('NoTab', {
                screen: 'LoginRegisterNavigator',
                params: {
                  screen: 'LoginMain',
                },
              });
            },
          },
          {text: '계속 둘러보기', style: 'default'},
        ],
        {
          cancelable: true,
        },
      );
      return false;
    }

    return true;
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
export const useVoiceToText = (): [() => void, boolean] => {
  const [writingStory, setWritingStory] = useRecoilState(writingStoryState);
  const setVoiceToTextProcessing = useSetRecoilState(isVoiceToTextProcessing);
  const voiceHttpPayLoad = useVoiceHttpPayLoad();
  const isTest = false;
  const [isLoading, voiceToText] = useAuthAxios<any>({
    requestOption: {
      method: 'post',
      url: `/stories/speech-to-text?isTest=${isTest}`,
      headers: {'Content-Type': 'multipart/form-data'},
      timeout: 30_000, // speech to text 시 10~20초가 걸려 30초로 하며 관련 처리 시간 단축 시 timeout 조정 필요
    },
    onResponseSuccess: res => {
      if (res) {
        setWritingStory({storyText: writingStory.storyText ?? '' + res});
      }
      setVoiceToTextProcessing(false);
    },
    onError: err => {
      setVoiceToTextProcessing(false);
      Alert.alert('음성 텍스트 변환에 실패했습니다. 재시도 부탁드립니다.');
    },
    disableInitialRequest: true,
  });

  useEffect(() => {
    setVoiceToTextProcessing(isLoading);
  }, [isLoading]);

  const submit = function () {
    voiceToText({data: voiceHttpPayLoad});
  };

  function validate(): boolean {
    if (!writingStory?.voice) {
      Alert.alert('음성을 녹음해주세요.');
      return false;
    }
    return true;
  }

  return [
    () => {
      if (!validate()) {
        return;
      }
      submit();
    },
    isLoading,
  ];
};
export const useIsStoryUploading = (): boolean => {
  const storyUploadingStatus = useRecoilValue(isStoryUploading);

  return storyUploadingStatus;
};

export const useIsVoiceToTextProcessing = (): boolean => {
  const voiceToTextProcessingStatus = useRecoilValue(isVoiceToTextProcessing);

  return voiceToTextProcessingStatus;
};
