import {atom, selector} from 'recoil';
import {AuthTokens} from '../types/auth.type';

export const authState = atom<AuthTokens>({
  key: 'authState',
  default: {
    accessToken: '',
    accessTokenExpireAt: new Date(),
    refreshToken: '',
    refreshTokenExpireAt: new Date(),
  },
});

export const isLoggedInState = selector({
  key: 'loginState',
  get: ({get}) => {
    const auth = get(authState);
    if (!auth) {
      return false;
    }

    const accessTokenExpireAt =
      auth.accessTokenExpireAt instanceof Date
        ? auth.accessTokenExpireAt
        : Date.parse(auth.accessTokenExpireAt);
    const refreshTokenExpireAt =
      auth.refreshTokenExpireAt instanceof Date
        ? auth.refreshTokenExpireAt
        : Date.parse(auth.refreshTokenExpireAt);
    const current = Date.now();

    return refreshTokenExpireAt >= current || accessTokenExpireAt >= current;
  },
});
