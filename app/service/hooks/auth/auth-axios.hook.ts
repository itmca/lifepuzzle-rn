import {AxiosError, AxiosRequestConfig} from 'axios';

import {useAuthStore} from '../../../stores/auth.store';
import {getTokenState} from '../../auth.service';
import {useRefreshAuthTokens} from '../refresh.hook';
import {useLogout} from '../logout.hook';
import {AuthTokens} from '../../../types/auth/auth.type';
import {useAxios} from '../core/axios.hook';
import {useEffect, useState} from 'react';

type AuthAxiosParams<R> = {
  requestOption: AxiosRequestConfig;
  onResponseSuccess: (data: R) => void;
  onError?: (error: AxiosError) => void;
  onTokenExpire?: () => void;
  onLoadingStatusChange?: (isLoading: boolean) => void;
  disableInitialRequest?: boolean;
};

type AuthAxiosReturn = [
  boolean,
  (newRequestOption: Partial<AxiosRequestConfig>) => void,
];

export const useAuthAxios = <R>({
  requestOption,
  onResponseSuccess,
  onError,
  onTokenExpire,
  onLoadingStatusChange,
  disableInitialRequest = false,
}: AuthAxiosParams<R>): AuthAxiosReturn => {
  const recoilTokens = useAuthStore(state => state.authTokens);
  const refreshAuthTokens = useRefreshAuthTokens();
  const logout = useLogout();
  const [loading, setLoading] = useState(false);

  const fetchData = (
    axiosConfig: AxiosRequestConfig,
    paramTokens?: AuthTokens,
  ) => {
    const tokens = paramTokens ? paramTokens : recoilTokens;
    const tokenState = getTokenState(tokens);

    if (tokenState === 'Expire') {
      logout();
      onTokenExpire?.();
      return;
    } else if (tokenState === 'Refresh') {
      refreshAuthTokens({
        onRefreshSuccess: refreshedTokens => {
          fetchData(axiosConfig, refreshedTokens);
        },
      });
      return;
    }

    // Add auth headers to the config
    const authenticatedConfig = {
      ...axiosConfig,
      headers: {
        Authorization: tokens.accessToken && `Bearer ${tokens.accessToken}`,
        ...axiosConfig.headers,
      },
    };

    // Use the basic axios hook with authenticated config
    makeRequest(authenticatedConfig);
  };

  const [, makeRequest] = useAxios({
    requestOption,
    onResponseSuccess,
    onError,
    onLoadingStatusChange: (isLoading: boolean) => {
      setLoading(isLoading);
      onLoadingStatusChange?.(isLoading);
    },
    disableInitialRequest: true, // We handle initial request manually
  });

  useEffect(() => {
    if (!disableInitialRequest) {
      fetchData(requestOption);
    }
  }, []);

  const authenticatedMakeRequest = (
    newRequestOption: Partial<AxiosRequestConfig>,
  ) => {
    fetchData({
      ...requestOption,
      ...newRequestOption,
    });
  };

  return [loading, authenticatedMakeRequest];
};
