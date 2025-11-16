import {AxiosError, AxiosRequestConfig} from 'axios';
import {useEffect, useState} from 'react';
import {HttpService} from './http.service';
import {ApiHookParams, ApiHookReturn} from '../../types/hooks/common.type';

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
    const preparedConfig = HttpService.prepareRequestConfig(axiosConfig);
    const client = HttpService.createAxiosInstance();

    setLoading(true);

    client
      .request<TResponse>(preparedConfig)
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
