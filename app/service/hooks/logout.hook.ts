import {useResetRecoilState} from 'recoil';
import {LocalStorage} from '../local-storage.service';
import {userState} from '../../recoils/user.recoil';
import {authState} from '../../recoils/auth.recoil';
import {heroState} from '../../recoils/hero.recoil';
import {useNavigation} from '@react-navigation/native';
import {SelectedStoryKeyState} from '../../recoils/story-view.recoil';
import {writingStoryState} from '../../recoils/story-write.recoil';
import {ageGroupsState, tagState} from '../../recoils/photos.recoil';

type Option = {
  customGoBackAction?: () => void;
};

export const useLogout = (option?: Option) => {
  const navigation = useNavigation();

  const resetAuth = useResetRecoilState(authState);
  const resetUser = useResetRecoilState(userState);
  const resetHero = useResetRecoilState(heroState);
  const resetWritingStory = useResetRecoilState(writingStoryState);
  const resetSelectedStory = useResetRecoilState(SelectedStoryKeyState);
  const resetAgeGroups = useResetRecoilState(ageGroupsState);
  const resetTag = useResetRecoilState(tagState);

  const resetAllRecoil = () => {
    resetAuth();
    resetUser();
    resetHero();
    resetWritingStory();
    resetSelectedStory();
    resetAgeGroups();
    resetTag();
  };

  const removeLocalStorage = () => {
    LocalStorage.delete('authToken');
    LocalStorage.delete('userNo');
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
