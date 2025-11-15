import axios, {AxiosError, AxiosRequestConfig} from 'axios';
import {useEffect, useState} from 'react';
import {SERVER_HOST} from '../../../constants/url.constant';
import {convertDateStringToDate} from '../../json-convert.service';
import logger from '../../../utils/logger';

import {ApiHookParams, ApiHookReturn} from '../../../types/hooks/common.type';

type AxiosHookParams<TResponse> = ApiHookParams<TResponse>;
type AxiosHookReturn = ApiHookReturn;

export const useAxios = <TResponse>({
  requestOption,
  onResponseSuccess,
  onError,
  onLoadingStatusChange,
  disableInitialRequest = false,
}: AxiosHookParams<TResponse>): AxiosHookReturn => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (disableInitialRequest) {
      return;
    }
    fetchData(requestOption);
  }, []);

  useEffect(() => {
    onLoadingStatusChange?.(loading);
  }, [loading]);

  const fetchData = (axiosConfig: AxiosRequestConfig) => {
    const url = axiosConfig.url || '';
    axiosConfig.url = url.startsWith('http') ? url : SERVER_HOST + url;

    logger.debug(axiosConfig.url);
    setLoading(true);

    const client = axios.create();

    client.interceptors.response.use<TResponse>(r => {
      return convertDateStringToDate(r);
    });

    client
      .request<TResponse>({
        timeout: 5000,
        ...axiosConfig,
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
