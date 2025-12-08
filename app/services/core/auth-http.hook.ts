import { AxiosError, AxiosRequestConfig } from 'axios';

import { useAuthStore } from '../../stores/auth.store.ts';
import { getTokenState } from './auth.service.ts';
import { useRefreshAuthTokens } from '../auth/refresh.hook.ts';
import { useLogout } from '../auth/logout.hook.ts';
import { AuthTokens } from '../../types/auth/auth.type.ts';
import { useAxios } from './http.hook.ts';
import { useCallback, useEffect, useRef, useState } from 'react';

// Re-export useAxios for convenience
export { useAxios };

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
  const authTokens = useAuthStore(state => state.authTokens);
  const refreshAuthTokens = useRefreshAuthTokens();
  const logout = useLogout();
  const [loading, setLoading] = useState(false);

  // Use refs to store latest values to avoid dependency changes
  const authTokensRef = useRef(authTokens);
  const requestOptionRef = useRef(requestOption);
  const onTokenExpireRef = useRef(onTokenExpire);
  const onLoadingStatusChangeRef = useRef(onLoadingStatusChange);

  // Update refs when values change
  useEffect(() => {
    authTokensRef.current = authTokens;
  }, [authTokens]);

  useEffect(() => {
    requestOptionRef.current = requestOption;
  }, [requestOption]);

  useEffect(() => {
    onTokenExpireRef.current = onTokenExpire;
  }, [onTokenExpire]);

  useEffect(() => {
    onLoadingStatusChangeRef.current = onLoadingStatusChange;
  }, [onLoadingStatusChange]);

  const handleLoadingStatusChange = useCallback((isLoading: boolean) => {
    setLoading(isLoading);
    onLoadingStatusChangeRef.current?.(isLoading);
  }, []);

  const [, makeRequest] = useAxios({
    requestOption,
    onResponseSuccess,
    onError,
    onLoadingStatusChange: handleLoadingStatusChange,
    disableInitialRequest: true, // We handle initial request manually
  });

  const fetchData = useCallback(
    (axiosConfig: AxiosRequestConfig, paramTokens?: AuthTokens) => {
      const tokens = paramTokens ? paramTokens : authTokensRef.current;
      const tokenState = getTokenState(tokens);

      if (tokenState === 'Expire') {
        logout();
        onTokenExpireRef.current?.();
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
    },
    [logout, makeRequest, refreshAuthTokens],
  );

  // Initial request - only run once on mount if not disabled
  const initialRequestDone = useRef(false);
  useEffect(() => {
    if (disableInitialRequest || initialRequestDone.current) {
      return;
    }
    initialRequestDone.current = true;
    fetchData(requestOptionRef.current);
  }, [disableInitialRequest, fetchData]);

  const authenticatedMakeRequest = useCallback(
    (newRequestOption: Partial<AxiosRequestConfig>) => {
      fetchData({
        ...requestOptionRef.current,
        ...newRequestOption,
      });
    },
    [fetchData],
  );

  return [loading, authenticatedMakeRequest];
};
