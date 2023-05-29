import {useRecoilState} from 'recoil';
import {authState} from '../../recoils/auth.recoil';
import {SERVER_HOST} from '../../constants/url.constant';
import axios, {AxiosError} from 'axios';
import {convertDateStringToDate} from '../json-convert.service';
import {LocalStorage} from '../local-storage.service';
import {Alert} from 'react-native';
import {useLogout} from './logout.hook';
import {useEffect, useState} from 'react';
import {AuthTokens} from '../../types/auth.type';

type RefreshParams = {
  onRefreshSuccess?: () => void;
  onError?: (error: AxiosError) => void;
};

type IsRefreshInErrorType = 'BeforeSelect' | 'Retry' | 'NoRetry';

export const useRefreshAuthTokens = () => {
  const [userRetryChoice, setUserRetryChoice] =
    useState<IsRefreshInErrorType>('BeforeSelect');
  const [tokens, setAuthTokens] = useRecoilState(authState);
  const logout = useLogout();

  useEffect(() => {
    if (userRetryChoice == 'BeforeSelect') {
      return;
    }

    if (userRetryChoice == 'Retry') {
      refreshAuthTokens();
    } else if (userRetryChoice === 'NoRetry') {
      logout();
    }

    setUserRetryChoice('BeforeSelect');
  }, [userRetryChoice]);

  const refreshAuthTokens = ({
    onRefreshSuccess,
    onError,
  }: RefreshParams = {}) => {
    if (!tokens.refreshToken) {
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
        url: `${SERVER_HOST}/auth/refresh`,
        headers: {
          Authorization: tokens.refreshToken && `Bearer ${tokens.refreshToken}`,
        },
      })
      .then(r => r.data)
      .then(responseTokens => {
        setAuthTokens(responseTokens);
        LocalStorage.set('authToken', JSON.stringify(responseTokens));

        onRefreshSuccess?.();
      })
      .catch(err => {
        if (onError) {
          onError(err);
        } else {
          const status: number = err.response?.status || 500;

          if (400 <= status && status < 500) {
            logout();
          } else if (500 <= status) {
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
  };

  return refreshAuthTokens;
};
