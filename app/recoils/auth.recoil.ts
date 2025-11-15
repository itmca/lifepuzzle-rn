import {atom, selector} from 'recoil';
import {AuthTokens} from '../types/auth.type';
import {getTokenState} from '../service/auth.service';

export const authState = atom<AuthTokens>({
  key: 'authState',
  default: {
    accessToken: '',
    refreshToken: '',
  },
});

export const isLoggedInState = selector({
  key: 'isLoggedInState',
  get: ({get}) => {
    const auth = get(authState);
    if (!auth || !auth.accessToken) {
      return false;
    }

    const tokenState = getTokenState(auth);
    return tokenState !== 'Expire';
  },
});
