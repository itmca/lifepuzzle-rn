import {useRecoilValue, useResetRecoilState, useSetRecoilState} from 'recoil';
import {LocalStorage} from '../local-storage.service';
import {userState} from '../../recoils/user.recoil';
import {authState, isLoggedInState} from '../../recoils/auth.recoil';
import {heroState} from '../../recoils/hero.recoil';
import {AuthTokens} from '../../types/auth.type';
import {UserType} from '../../types/user.type';
import {HeroType} from '../../types/hero.type';
import {useNavigation} from '@react-navigation/native';
import {Alert} from 'react-native';
import {useEffect} from 'react';
import {BasicNavigationProps} from '../../navigation/types';
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
    setAuthTokens({
      ...tokens,
      accessTokenExpireAt: new Date(tokens.accessTokenExpireAt),
      refreshTokenExpireAt: new Date(tokens.refreshTokenExpireAt),
    });
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

type LoginCheckingParams = {
  alertTitle: string;
};
export const useLoginChecking = ({
  alertTitle = '로그인이 필요합니다',
}: LoginCheckingParams) => {
  const isLoggedIn = useRecoilValue<boolean>(isLoggedInState);
  const alertLogin = useLoginAlert();

  useEffect(() => {
    if (isLoggedIn) {
      return;
    }

    alertLogin({
      title: alertTitle,
    });
  }, []);
};

type AlertParams = {
  title: string;
};
export const useLoginAlert = () => {
  const navigation = useNavigation<BasicNavigationProps>();

  return (
    {title}: AlertParams = {
      title: '로그인이 필요합니다',
    },
  ) => {
    Alert.alert(
      title,
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
  };
};
