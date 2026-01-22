import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { useCallback } from 'react';
import { performAuthenticatedRequest } from './auth-request.helper.ts';
import { useRefreshAuthTokens } from '../auth/refresh.hook.ts';
import { useLogout } from '../auth/logout.hook.ts';

type AuthMutationOptions<TData> = {
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

export const useAuthMutation = <TData>({
  axiosConfig,
  onSuccess,
  onError,
}: AuthMutationOptions<TData>): [
  boolean,
  (overrideConfig?: Partial<AxiosRequestConfig>) => Promise<TData>,
] => {
  const logout = useLogout();
  const refreshAuthTokens = useRefreshAuthTokens();

  const mutation = useMutation<TData, AxiosError, Partial<AxiosRequestConfig>>({
    mutationFn: overrideConfig =>
      performAuthenticatedRequest<TData>(
        {
          ...axiosConfig,
          ...overrideConfig,
          headers: {
            ...axiosConfig.headers,
            ...overrideConfig.headers,
          },
        },
        { refreshAuthTokens, logout },
      ),
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
