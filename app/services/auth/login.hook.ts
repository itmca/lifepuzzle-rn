import { LocalStorage } from '../core/local-storage.service.ts';
import { SecureStorage } from '../core/secure-storage.service.ts';
import { AuthTokens } from '../../types/auth/auth.type.ts';
import { UserType } from '../../types/core/user.type.ts';
import { HeroType } from '../../types/core/hero.type.ts';
import { useNavigation } from '@react-navigation/native';
import { BasicNavigationProps } from '../../navigation/types.tsx';
import { useAuthStore } from '../../stores/auth.store.ts';
import { useUserStore } from '../../stores/user.store.ts';
import { useHeroStore } from '../../stores/hero.store.ts';
import { useShareStore } from '../../stores/share.store.ts';
import { showToast } from '../../components/ui/feedback/Toast';

type Option = {
  customGoBackAction?: () => void;
};

export type LoginResponse = {
  user: UserType;
  tokens: AuthTokens;
  hero: HeroType;
};

export const useLoginResponseHandler = (option?: Option) => {
  const navigation = useNavigation<BasicNavigationProps>();
  const setUser = useUserStore(state => state.setUser);
  const setAuthTokens = useAuthStore(state => state.setAuthTokens);
  const setHero = useHeroStore(state => state.setCurrentHero);
  const resetShare = useShareStore(state => state.resetShare);

  return (loginResponse: LoginResponse) => {
    const { user, tokens, hero } = loginResponse;

    setUser(user);
    setAuthTokens(tokens);
    setHero(hero);
    resetShare();

    SecureStorage.setAuthTokens(tokens);
    LocalStorage.set('userNo', user.id);

    if (typeof option?.customGoBackAction === 'function') {
      option?.customGoBackAction();
    } else {
      // hasHero가 false이면 주인공 추가 화면으로 이동
      if (!user.hasHero) {
        showToast('기록을 시작하기 전에, 주인공을 먼저 추가해 주세요');
        navigation.navigate('App', {
          screen: 'HeroSettingNavigator',
          params: {
            screen: 'HeroRegisterStep1',
            params: {
              source: 'login',
            },
          },
        });
      } else {
        navigation.navigate('App', {
          screen: 'Home',
        });
      }
    }
  };
};
