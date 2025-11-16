import {LocalStorage} from '../local-storage.service';
import {useNavigation} from '@react-navigation/native';
import {useAuthStore} from '../../stores/auth.store';
import {useUserStore} from '../../stores/user.store';
import {useHeroStore} from '../../stores/hero.store';
import {useStoryStore} from '../../stores/story.store';
import {useMediaStore} from '../../stores/media.store';

type Option = {
  customGoBackAction?: () => void;
};

export const useLogout = (option?: Option) => {
  const navigation = useNavigation();

  const resetAuth = useAuthStore(state => state.clearAuth);
  const resetUser = useUserStore(state => state.resetUser);
  const resetHero = useHeroStore(state => state.resetHero);
  const resetWritingStory = useStoryStore(state => state.resetWritingStory);
  const resetSelectedStory = useStoryStore(
    state => state.resetSelectedStoryKey,
  );
  const resetAgeGroups = useMediaStore(state => state.resetAgeGroups);
  const resetTag = useMediaStore(state => state.resetTags);

  const resetAllStores = () => {
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
    resetAllStores();
    removeLocalStorage();

    if (typeof option?.customGoBackAction === 'function') {
      option?.customGoBackAction();
    } else {
      navigation.navigate('NoTab', {
        screen: 'LoginRegisterNavigator',
        params: {
          screen: 'LoginMain',
        },
      });
    }
  };
};
