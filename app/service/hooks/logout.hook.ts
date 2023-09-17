import {useResetRecoilState} from 'recoil';
import {LocalStorage} from '../local-storage.service';
import {userState} from '../../recoils/user.recoil';
import {authState} from '../../recoils/auth.recoil';
import {heroState} from '../../recoils/hero.recoil';
import {useNavigation} from '@react-navigation/native';
import {selectedPhotoState} from '../../recoils/selected-photo.recoil';
import {SelectedStoryKeyState} from '../../recoils/story-view.recoil';
import {
  helpQuestionState,
  helpQuestionTextState,
  recordFileState,
  storyDateState,
  storyTextState,
} from '../../recoils/story-write.recoil';

type Option = {
  customGoBackAction?: () => void;
};

export const useLogout = (option?: Option) => {
  const navigation = useNavigation();

  const resetAuth = useResetRecoilState(authState);
  const resetUser = useResetRecoilState(userState);
  const resetHero = useResetRecoilState(heroState);
  const resetQuestionText = useResetRecoilState(helpQuestionTextState);
  const resetSelectedPhoto = useResetRecoilState(selectedPhotoState);
  const resetSelectedStory = useResetRecoilState(SelectedStoryKeyState);
  const resetQuestion = useResetRecoilState(helpQuestionState);
  const resetStoryText = useResetRecoilState(storyTextState);
  const resetStoryDate = useResetRecoilState(storyDateState);
  const resetRecordFile = useResetRecoilState(recordFileState);

  const resetAllRecoil = () => {
    resetAuth();
    resetUser();
    resetHero();
    resetQuestionText();
    resetSelectedCategory();
    resetSelectedPhoto();
    resetSelectedStory();
    resetQuestion();
    resetStoryText();
    resetStoryDate();
    resetRecordFile();
  };

  const removeLocalStorage = () => {
    LocalStorage.delete('authToken');
    LocalStorage.delete('useNo');
  };

  return () => {
    resetAllRecoil();
    removeLocalStorage();

    if (typeof option?.customGoBackAction === 'function') {
      option?.customGoBackAction();
    } else {
      navigation.navigate('HomeTab', {
        screen: 'Home',
      });
    }
  };
};
