import axios, {AxiosError, AxiosRequestConfig} from 'axios';
import {useEffect, useState} from 'react';
import {useRecoilValue} from 'recoil';
import {authState} from '../../recoils/auth.recoil';
import {SERVER_HOST} from '../../constants/url.constant';
import {getTokenState} from '../auth.service';
import {convertDateStringToDate} from '../json-convert.service';
import {useRefreshAuthTokens} from './refresh.hook';
import {useLogout} from './logout.hook';
import {AuthTokens} from '../../types/auth.type';
import logger from '../../utils/logger';

type Param<R> = {
  requestOption: AxiosRequestConfig;
  onResponseSuccess: (data: R) => void;
  onError?: (error: AxiosError) => void;
  onTokenExpire?: () => void;
  onLoadingStatusChange?: (isLoading: boolean) => void;
  disableInitialRequest?: boolean;
  needAuthenticated?: boolean;
};

type Return = [
  boolean,
  (newRequestOption: Partial<AxiosRequestConfig>) => void,
];

export const useAuthAxios = <R>(
  param: Omit<Param<R>, 'needAuthenticated'>,
): Return => {
  return useAxios({
    ...param,
    needAuthenticated: true,
  });
};

export const useAxios = <R>({
  requestOption,
  onResponseSuccess,
  onError,
  onTokenExpire,
  onLoadingStatusChange,
  disableInitialRequest = false,
  needAuthenticated = false,
}: Param<R>): Return => {
  const [loading, setLoading] = useState(false);

  const recoilTokens = useRecoilValue(authState);
  const refreshAuthTokens = useRefreshAuthTokens();

  const logout = useLogout();

  useEffect(() => {
    if (disableInitialRequest) {
      return;
    }

    fetchData(requestOption);
  }, []);

  useEffect(() => {
    onLoadingStatusChange?.(loading);
  }, [loading]);

  const fetchData = (
    axiosConfig: AxiosRequestConfig,
    paramTokens?: AuthTokens,
  ) => {
    const tokens = paramTokens ? paramTokens : recoilTokens;
    const tokenState = getTokenState(tokens);

    if (needAuthenticated && tokenState === 'Expire') {
      logout();
      onTokenExpire?.();
      return;
    } else if (needAuthenticated && tokenState === 'Refresh') {
      refreshAuthTokens({
        onRefreshSuccess: refreshedTokens => {
          fetchData(axiosConfig, refreshedTokens);
        },
      });
      return;
    }

    const url = axiosConfig.url || '';
    axiosConfig.url = url.startsWith('http') ? url : SERVER_HOST + url;

    logger.debug(axiosConfig.url);
    console.log(axiosConfig.url);

    setLoading(true);

    const client = axios.create();

    client.interceptors.response.use<R>(r => {
      return convertDateStringToDate(r);
    });

    client
      .request<R>({
        timeout: 5000,
        ...axiosConfig,
        headers: {
          Authorization: tokens.accessToken && `Bearer ${tokens.accessToken}`,
          ...axiosConfig.headers,
        },
      })
      .then(r => r.data)
      .then(onResponseSuccess)
      .catch(onError)
      .finally(() => {
        setLoading(false);
      });
  };

  return [
    loading,
    (newRequestOption: Partial<AxiosRequestConfig>) => {
      void fetchData({
        ...requestOption,
        ...newRequestOption,
      });
    },
  ];
};
