import { AxiosRequestConfig } from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { HttpService } from './http.service.ts';
import { ApiHookParams } from '../../types/hooks/common.type.ts';
import { useRefSync } from '../../hooks/useRefSync.hook.ts';

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
  const requestOptionRef = useRefSync(requestOption);
  const onResponseSuccessRef = useRefSync(onResponseSuccess);
  const onErrorRef = useRefSync(onError);
  const onLoadingStatusChangeRef = useRefSync(onLoadingStatusChange);

  const fetchData = useCallback((axiosConfig: AxiosRequestConfig) => {
    const preparedConfig = HttpService.prepareRequestConfig(axiosConfig);
    const client = HttpService.createAxiosInstance();

    setLoading(true);

    client
      .request<TResponse>(preparedConfig)
      .then(r => r.data)
      .then(data => onResponseSuccessRef.current(data))
      .catch(error => {
        onErrorRef.current?.(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Initial request - only run once on mount if not disabled
  const initialRequestDone = useRef(false);
  useEffect(() => {
    if (disableInitialRequest || initialRequestDone.current) {
      return;
    }
    initialRequestDone.current = true;
    fetchData(requestOptionRef.current);
  }, [disableInitialRequest, fetchData]);

  useEffect(() => {
    onLoadingStatusChangeRef.current?.(loading);
  }, [loading]);

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
