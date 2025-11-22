import { LocalStorage } from '../core/local-storage.service';
import { AuthTokens } from '../../types/auth/auth.type';
import { UserType } from '../../types/core/user.type';
import { HeroType } from '../../types/core/hero.type';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../stores/auth.store';
import { useUserStore } from '../../stores/user.store';
import { useHeroStore } from '../../stores/hero.store';
import { useUIStore } from '../../stores/ui.store';

type Option = {
  customGoBackAction?: () => void;
};

export type LoginResponse = {
  user: UserType;
  tokens: AuthTokens;
  hero: HeroType;
};

export const useLoginResponseHandler = (option?: Option) => {
  const navigation = useNavigation();
  const setUser = useUserStore(state => state.setUser);
  const setAuthTokens = useAuthStore(state => state.setAuthTokens);
  const setHero = useHeroStore(state => state.setCurrentHero);
  const resetShareKey = useUIStore(state => state.resetShareKey);

  return (loginResponse: LoginResponse) => {
    const { user, tokens, hero } = loginResponse;

    setUser(user);
    setAuthTokens(tokens);
    setHero(hero);
    resetShareKey();

    LocalStorage.set('authToken', JSON.stringify(tokens));
    LocalStorage.set('userNo', user.userNo);

    if (typeof option?.customGoBackAction === 'function') {
      option?.customGoBackAction();
    } else {
      navigation.navigate('App', {
        screen: 'Home',
      });
    }
  };
};
