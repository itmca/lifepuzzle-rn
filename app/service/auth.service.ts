import {AuthTokens, TokenState} from '../types/auth/auth.type';

// JWT 페이로드 디코딩 (exp 클레임 추출)
const decodeJWTPayload = (token: string): {exp?: number} => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return {};
    }

    // Base64Url 디코딩
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
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
