import {useRecoilValue, useResetRecoilState, useSetRecoilState} from 'recoil';
import {
  writingStoryState,
  postStoryKeyState,
  selectedStoryKeyState,
} from '../../recoils/content/story.recoil';
import {uploadState} from '../../recoils/ui/upload.recoil';
import {isModalOpening} from '../../recoils/ui/modal.recoil';
import {useAuthAxios} from './network.hook';
import {Alert} from 'react-native';
import {useUpdatePublisher} from './update.hooks';
import {storyListUpdate} from '../../recoils/shared/cache.recoil';
import {useNavigation} from '@react-navigation/native';
import {isLoggedInState} from '../../recoils/auth/auth.recoil';
import {BasicNavigationProps} from '../../navigation/types';
import {useEffect} from 'react';
import {heroState} from '../../recoils/content/hero.recoil.ts';
import {useStoryHttpPayLoad} from './story.payload.hook.ts';

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
  const setStoryUploading = (value: boolean) => setUploadState(prev => ({...prev, story: value}));
  const isLoggedIn = useRecoilValue<boolean>(isLoggedInState);

  const publishStoryListUpdate = useUpdatePublisher(storyListUpdate);
  const resetAllWritingStory = useResetAllWritingStory();
  const storyHttpPayLoad = useStoryHttpPayLoad();
  const hero = useRecoilValue(heroState);

  const setModalOpen = useSetRecoilState(isModalOpening);
  const setPostStoryKey = useSetRecoilState(postStoryKeyState);

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
    saveStory({
      data: storyHttpPayLoad,
    });
  };

  function validate(): boolean {
    if (
      !writingStory?.title &&
      !writingStory?.content &&
      !writingStory?.voice
    ) {
      Alert.alert('제목, 글, 음성 중 하나는 입력되어야 합니다.');
      return false;
    } else if (writingStory?.title && writingStory.title.length > 20) {
      Alert.alert('제목은 20자 이내로 입력해주세요.');
      return false;
    } else if (writingStory?.content && writingStory.content.length > 1000) {
      Alert.alert('내용은 1000자 이내로 입력해주세요.');
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

export const useIsStoryUploading = (): boolean => {
  const uploadStateValue = useRecoilValue(uploadState);
  return uploadStateValue.story;
};
