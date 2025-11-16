import {getTokenState} from './auth.service';
import {AuthTokens} from '../types/auth/auth.type';

// Mock JWT tokens for testing
const createMockToken = (exp: number): string => {
  const header = btoa(JSON.stringify({alg: 'HS256', typ: 'JWT'}));
  const payload = btoa(JSON.stringify({exp}));
  const signature = 'mock-signature';
  return `${header}.${payload}.${signature}`;
};

test.each(['', undefined, null])(
  'access token이 없는 경우 Expire를 반환한다.',
  accessToken => {
    const result = getTokenState(<AuthTokens>{
      accessToken: accessToken,
      refreshToken: 'refresh-token',
    });

    expect(result).toBe('Expire');
  },
);

test('access token과 refesh token이 모두 만료한 경우 Expire를 반환한다.', () => {
  const expiredTime = Math.floor(Date.now() / 1000) - 1; // 1초 전 만료
  const expiredAccessToken = createMockToken(expiredTime);
  const expiredRefreshToken = createMockToken(expiredTime);

  const result = getTokenState({
    accessToken: expiredAccessToken,
    refreshToken: expiredRefreshToken,
  });

  expect(result).toBe('Expire');
});

test('access token이 만료하지 않은 경우 Use를 반환한다.', () => {
  const validTime = Math.floor(Date.now() / 1000) + 3600; // 1시간 후 만료
  const expiredTime = Math.floor(Date.now() / 1000) - 1; // 1초 전 만료

  const validAccessToken = createMockToken(validTime);
  const expiredRefreshToken = createMockToken(expiredTime);

  const result = getTokenState({
    accessToken: validAccessToken,
    refreshToken: expiredRefreshToken,
  });

  expect(result).toBe('Use');
});

test('access token이 만료했지만 refresh Token이 만료하지 않은 경우 Refresh를 반환한다.', () => {
  const expiredTime = Math.floor(Date.now() / 1000) - 1; // 1초 전 만료
  const validTime = Math.floor(Date.now() / 1000) + 3600; // 1시간 후 만료

  const expiredAccessToken = createMockToken(expiredTime);
  const validRefreshToken = createMockToken(validTime);

  const result = getTokenState({
    accessToken: expiredAccessToken,
    refreshToken: validRefreshToken,
  });

  expect(result).toBe('Refresh');
});
