import {useRecoilValue, useResetRecoilState} from 'recoil';
import {
  helpQuestionState,
  recordFileState,
  storyTextState,
  writingStoryState,
} from '../../recoils/story-writing.recoil';
import {selectedPhotoState} from '../../recoils/selected-photo.recoil';
import {useAuthAxios} from './network.hook';
import {Alert} from 'react-native';
import {useUpdatePublisher} from './update.hooks';
import {storyListUpdate} from '../../recoils/update.recoil';
import {useNavigation} from '@react-navigation/native';
import {isLoggedInState} from '../../recoils/auth.recoil';
import {useStoryHttpPayLoad} from './story.payload.hook';
import {BasicNavigationProps} from '../../navigation/types';

export const useResetAllWritingStory = () => {
  const resetStoryText = useResetRecoilState(storyTextState);
  const resetHelpQuestion = useResetRecoilState(helpQuestionState);
  const resetSelectedPhoto = useResetRecoilState(selectedPhotoState);
  const resetRecord = useResetRecoilState(recordFileState);

  return () => {
    resetStoryText();
    resetHelpQuestion();
    resetSelectedPhoto();
    resetRecord();
  };
};

export const useSaveStory = (): [() => void, boolean] => {
  const navigation = useNavigation<BasicNavigationProps>();

  const writingStory = useRecoilValue(writingStoryState);
  const isLoggedIn = useRecoilValue<boolean>(isLoggedInState);

  const publishStoryListUpdate = useUpdatePublisher(storyListUpdate);
  const resetAllWritingStory = useResetAllWritingStory();
  const storyHttpPayLoad = useStoryHttpPayLoad();

  const [isLoading, saveStory] = useAuthAxios<any>({
    requestOption: {
      method: 'post',
      url: '/story',
      headers: {'Content-Type': 'multipart/form-data'},
    },
    onResponseSuccess: () => {
      resetAllWritingStory();
      publishStoryListUpdate();
      navigation.navigate('HomeTab', {screen: 'Home'});
    },
    onError: err => {
      console.log(err);
      Alert.alert('파일 업로드가 실패했습니다. 재시도 부탁드립니다.');
    },
    disableInitialRequest: true,
  });

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
    isLoading,
  ];
};
