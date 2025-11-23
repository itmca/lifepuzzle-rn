import { useCallback } from 'react';
import { LocalStorage } from '../core/local-storage.service';
import { SecureStorage } from '../core/secure-storage.service';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../stores/auth.store';
import { useUserStore } from '../../stores/user.store';
import { useHeroStore } from '../../stores/hero.store';
import { useStoryStore } from '../../stores/story.store';
import { useMediaStore } from '../../stores/media.store';

type Option = {
  customGoBackAction?: () => void;
};

export const useLogout = (option?: Option) => {
  const navigation = useNavigation();
  const customGoBackAction = option?.customGoBackAction;

  const resetAuth = useAuthStore(state => state.clearAuth);
  const resetUser = useUserStore(state => state.resetUser);
  const resetHero = useHeroStore(state => state.resetHero);
  const resetWritingStory = useStoryStore(state => state.resetWritingStory);
  const resetSelectedStory = useStoryStore(
    state => state.resetSelectedStoryKey,
  );
  const resetAgeGroups = useMediaStore(state => state.resetAgeGroups);
  const resetTag = useMediaStore(state => state.resetTags);

  const logout = useCallback(() => {
    // Reset all stores
    resetAuth();
    resetUser();
    resetHero();
    resetWritingStory();
    resetSelectedStory();
    resetAgeGroups();
    resetTag();

    // Remove secure storage and local storage
    SecureStorage.removeAuthTokens();
    LocalStorage.delete('userNo');

    if (customGoBackAction) {
      customGoBackAction();
    } else {
      navigation.navigate('Auth', {
        screen: 'LoginRegisterNavigator',
        params: {
          screen: 'LoginMain',
        },
      });
    }
  }, [
    customGoBackAction,
    navigation,
    resetAgeGroups,
    resetAuth,
    resetHero,
    resetSelectedStory,
    resetTag,
    resetUser,
    resetWritingStory,
  ]);

  return logout;
};
