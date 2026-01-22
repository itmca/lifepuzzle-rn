import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { useCallback } from 'react';
import { HttpService } from './http.service.ts';

type HttpMutationOptions<TData> = {
  axiosConfig: AxiosRequestConfig;
  onSuccess?: UseMutationOptions<
    TData,
    AxiosError,
    Partial<AxiosRequestConfig>
  >['onSuccess'];
  onError?: UseMutationOptions<
    TData,
    AxiosError,
    Partial<AxiosRequestConfig>
  >['onError'];
};

export const useHttpMutation = <TData>({
  axiosConfig,
  onSuccess,
  onError,
}: HttpMutationOptions<TData>): [
  boolean,
  (overrideConfig?: Partial<AxiosRequestConfig>) => Promise<TData>,
] => {
  const mutation = useMutation<TData, AxiosError, Partial<AxiosRequestConfig>>({
    mutationFn: overrideConfig => {
      const client = HttpService.createAxiosInstance();
      const preparedConfig = HttpService.prepareRequestConfig({
        ...axiosConfig,
        ...overrideConfig,
        headers: {
          ...axiosConfig.headers,
          ...overrideConfig.headers,
        },
      });

      return client.request<TData>(preparedConfig).then(r => r.data);
    },
    onSuccess,
    onError,
  });

  const trigger = useCallback(
    (overrideConfig: Partial<AxiosRequestConfig> = {}) =>
      mutation.mutateAsync(overrideConfig),
    [mutation.mutateAsync],
  );

  return [mutation.isPending, trigger];
};
