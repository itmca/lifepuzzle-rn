import {getTokenState} from './auth.service';
import {AuthTokens} from '../types/auth.type';

test.each(['', undefined, null])(
  'access token이 없는 경우 Expire를 반환한다.',
  accessToken => {
    const result = getTokenState(<AuthTokens>{
      accessToken: accessToken,
      accessTokenExpireAt: new Date(),
      refreshToken: 'refresh-token',
      refreshTokenExpireAt: new Date(),
    });

    expect(result).toBe('Expire');
  },
);

test('access token과 refesh token이 모두 만료한 경우 Expire를 반환한다.', () => {
  const justBefore = new Date(Date.now() - 1);
  const result = getTokenState({
    accessToken: 'access-token',
    accessTokenExpireAt: justBefore,
    refreshToken: 'refresh-token',
    refreshTokenExpireAt: justBefore,
  });

  expect(result).toBe('Expire');
});

test('access token이 만료하지 않은 경우 Use를 반환한다.', () => {
  const oneSecondAfter = new Date(Date.now() + 1000);

  const result = getTokenState({
    accessToken: 'access-token',
    accessTokenExpireAt: oneSecondAfter,
    refreshToken: 'refresh-token',
    refreshTokenExpireAt: new Date(),
  });

  expect(result).toBe('Use');
});

test('access token이 만료했지만 refresh Token이 만료하지 않은 경우 Refresh를 반환한다.', () => {
  const justBefore = new Date(Date.now() - 1);
  const oneSecondAfter = new Date(Date.now() + 1000);

  const result = getTokenState({
    accessToken: 'access-token',
    accessTokenExpireAt: justBefore,
    refreshToken: 'refresh-token',
    refreshTokenExpireAt: oneSecondAfter,
  });

  expect(result).toBe('Refresh');
});
