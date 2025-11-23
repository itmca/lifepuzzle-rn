import { AxiosRequestConfig } from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { HttpService } from './http.service';
import { ApiHookParams } from '../../types/hooks/common.type';
import logger from '../../utils/logger';

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
  const onLoadingStatusChangeRef = useRef(onLoadingStatusChange);

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

  useEffect(() => {
    onLoadingStatusChangeRef.current = onLoadingStatusChange;
  }, [onLoadingStatusChange]);

  const fetchData = useCallback((axiosConfig: AxiosRequestConfig) => {
    const preparedConfig = HttpService.prepareRequestConfig(axiosConfig);
    const client = HttpService.createAxiosInstance();

    logger.debug('HTTP request URL:', axiosConfig.url);
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
