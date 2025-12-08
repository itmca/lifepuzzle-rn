import { jwtDecode, JwtPayload } from 'jwt-decode';
import { AuthTokens, TokenState } from '../../types/auth/auth.type.ts';

/**
 * Safely decode JWT payload using jwt-decode library
 * Returns empty object if decoding fails
 */
const decodeJWTPayload = (token: string): JwtPayload => {
  try {
    if (!token || typeof token !== 'string') {
      return {};
    }
    return jwtDecode<JwtPayload>(token);
  } catch {
    return {};
  }
};

export const getTokenState = (auth: AuthTokens): TokenState => {
  if (!auth || !auth.accessToken) {
    return 'Expire';
  }

  const currentTimeSeconds = Math.floor(Date.now() / 1000);

  // JWT의 exp 클레임 사용 (더 정확하고 timezone 문제 없음)
  const accessPayload = decodeJWTPayload(auth.accessToken);
  const refreshPayload = decodeJWTPayload(auth.refreshToken);

  const accessTokenExpireTime = accessPayload.exp || 0;
  const refreshTokenExpireTime = refreshPayload.exp || 0;

  const isAccessTokenValid = accessTokenExpireTime > currentTimeSeconds;
  const isRefreshTokenValid = refreshTokenExpireTime > currentTimeSeconds;

  if (isAccessTokenValid) {
    return 'Use';
  } else if (isRefreshTokenValid) {
    return 'Refresh';
  } else {
    return 'Expire';
  }
};
