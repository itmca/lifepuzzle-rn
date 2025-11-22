import { AxiosRequestConfig } from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { HttpService } from './http.service';
import { ApiHookParams } from '../../types/hooks/common.type';

type AxiosHookParams<TResponse> = ApiHookParams<TResponse>;
type AxiosHookReturn = [
  boolean,
  (newRequestOption: Partial<AxiosRequestConfig>) => void,
];

export const useAxios = <TResponse>({
  requestOption,
  onResponseSuccess,
  onError,
  onLoadingStatusChange,
  disableInitialRequest = false,
}: AxiosHookParams<TResponse>): AxiosHookReturn => {
  const [loading, setLoading] = useState(false);

  // Use refs to store latest callback values to avoid dependency changes
  const requestOptionRef = useRef(requestOption);
  const onResponseSuccessRef = useRef(onResponseSuccess);
  const onErrorRef = useRef(onError);

  // Update refs when values change
  useEffect(() => {
    requestOptionRef.current = requestOption;
  }, [requestOption]);

  useEffect(() => {
    onResponseSuccessRef.current = onResponseSuccess;
  }, [onResponseSuccess]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const fetchData = useCallback((axiosConfig: AxiosRequestConfig) => {
    const preparedConfig = HttpService.prepareRequestConfig(axiosConfig);
    const client = HttpService.createAxiosInstance();

    console.log('url - ', axiosConfig.url);
    setLoading(true);

    client
      .request<TResponse>(preparedConfig)
      .then(r => r.data)
      .then(data => onResponseSuccessRef.current(data))
      .catch(error => onErrorRef.current?.(error))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (disableInitialRequest) {
      return;
    }
    fetchData(requestOption);
  }, [disableInitialRequest, fetchData, requestOption]);

  useEffect(() => {
    onLoadingStatusChange?.(loading);
  }, [loading, onLoadingStatusChange]);

  const makeRequest = useCallback(
    (newRequestOption: Partial<AxiosRequestConfig>) => {
      void fetchData({
        ...requestOptionRef.current,
        ...newRequestOption,
      });
    },
    [fetchData],
  );

  return [loading, makeRequest];
};
