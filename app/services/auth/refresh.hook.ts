import { useAuthStore } from '../../stores/auth.store.ts';
import { SERVER_HOST } from '../../constants/url.constant.ts';
import axios, { AxiosError } from 'axios';
import { convertDateStringToDate } from '../../utils/json-convert.util.ts';
import { SecureStorage } from '../core/secure-storage.service.ts';
import { Alert } from 'react-native';
import { useLogout } from './logout.hook.ts';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AuthTokens } from '../../types/auth/auth.type.ts';

type RefreshParams = {
  onRefreshSuccess?: (refreshedTokens: AuthTokens) => void;
  onError?: (error: AxiosError) => void;
};

type IsRefreshInErrorType = 'BeforeSelect' | 'Retry' | 'NoRetry';

export const useRefreshAuthTokens = () => {
  const [userRetryChoice, setUserRetryChoice] =
    useState<IsRefreshInErrorType>('BeforeSelect');
  const tokens = useAuthStore(state => state.authTokens);
  const setAuthTokens = useAuthStore(state => state.setAuthTokens);
  const logout = useLogout();

  // Use ref to store latest tokens to avoid dependency changes
  const tokensRef = useRef(tokens);

  useEffect(() => {
    tokensRef.current = tokens;
  }, [tokens]);

  const refreshAuthTokens = useCallback(
    ({ onRefreshSuccess, onError }: RefreshParams = {}) => {
      const currentTokens = tokensRef.current;
      if (!currentTokens.refreshToken) {
        return;
      }

      const client = axios.create();

      client.interceptors.response.use(r => {
        return convertDateStringToDate(r);
      });

      client
        .request<AuthTokens>({
          timeout: 5000,
          method: 'post',
          url: `${SERVER_HOST}/v1/auth/refresh`,
          headers: {
            Authorization:
              currentTokens.refreshToken &&
              `Bearer ${currentTokens.refreshToken}`,
          },
        })
        .then(r => r.data)
        .then(responseTokens => {
          setAuthTokens(responseTokens);
          SecureStorage.setAuthTokens(responseTokens);

          onRefreshSuccess?.(responseTokens);
        })
        .catch(err => {
          if (onError) {
            onError(err);
          } else {
            const status: number = err.response?.status || 500;

            if (status >= 400 && status < 500) {
              logout();
            } else if (status >= 500) {
              Alert.alert(
                '네트워크 문제',
                '네트워크 연결을 다시 시도하시겠습니까?',
                [
                  {
                    text: '확인',
                    onPress: () => {
                      setUserRetryChoice('Retry');
                    },
                  },
                  {
                    text: '취소',
                    onPress: () => {
                      setUserRetryChoice('NoRetry');
                    },
                  },
                ],
              );
            }
          }
        });
    },
    [logout, setAuthTokens],
  );

  useEffect(() => {
    if (userRetryChoice === 'BeforeSelect') {
      return;
    }

    if (userRetryChoice === 'Retry') {
      refreshAuthTokens();
    } else if (userRetryChoice === 'NoRetry') {
      logout();
    }

    setUserRetryChoice('BeforeSelect');
  }, [logout, refreshAuthTokens, userRetryChoice]);

  return refreshAuthTokens;
};
