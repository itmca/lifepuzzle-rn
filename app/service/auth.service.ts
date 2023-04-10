import {AuthTokens, TokenState} from '../types/auth.type';

export const getTokenState = (auth: AuthTokens): TokenState => {
  if (!auth || !auth.accessToken) {
    return 'Expire';
  }

  const accessTokenExpireAt = auth.accessTokenExpireAt.getTime();
  const refreshTokenExpireAt = auth.refreshTokenExpireAt.getTime();
  const current = Date.now();

  const isAccessTokenUse = accessTokenExpireAt >= current;
  const isRefreshTokenUse = refreshTokenExpireAt >= current;

  if (isAccessTokenUse) {
    return 'Use';
  } else if (isRefreshTokenUse) {
    return 'Refresh';
  } else {
    return 'Expire';
  }
};
