export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  socialToken?: string;
};

export type TokenState = 'Use' | 'Refresh' | 'Expire';
