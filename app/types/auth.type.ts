export type AuthTokens = {
  accessToken: string;
  accessTokenExpireAt: Date;
  refreshToken: string;
  refreshTokenExpireAt: Date;
  socialToken?: string;
};

export type TokenState = 'Use' | 'Refresh' | 'Expire';
