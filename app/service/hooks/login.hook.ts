import {useResetRecoilState, useSetRecoilState} from 'recoil';
import {LocalStorage} from '../local-storage.service';
import {userState} from '../../recoils/user.recoil';
import {authState} from '../../recoils/auth.recoil';
import {heroState} from '../../recoils/hero.recoil';
import {AuthTokens} from '../../types/auth.type';
import {UserType} from '../../types/user.type';
import {HeroType} from '../../types/hero.type';
import {useNavigation} from '@react-navigation/native';
import {shareKeyState} from '../../recoils/share.recoil.ts';

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
  const setUser = useSetRecoilState(userState);
  const setAuthTokens = useSetRecoilState(authState);
  const setHero = useSetRecoilState(heroState);
  const resetShareKey = useResetRecoilState(shareKeyState);

  return (loginResponse: LoginResponse) => {
    const {user, tokens, hero} = loginResponse;

    setUser(user);
    setAuthTokens(tokens);
    setHero(hero);
    resetShareKey();

    LocalStorage.set('authToken', JSON.stringify(tokens));
    LocalStorage.set('userNo', user.userNo);

    if (typeof option?.customGoBackAction === 'function') {
      option?.customGoBackAction();
    } else {
      navigation.navigate('HomeTab', {
        screen: 'Home',
      });
    }
  };
};
