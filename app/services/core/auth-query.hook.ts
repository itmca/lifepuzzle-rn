import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { AxiosError, AxiosRequestConfig } from 'axios';

import { performAuthenticatedRequest } from './auth-request.helper.ts';
import { useRefreshAuthTokens } from '../auth/refresh.hook.ts';
import { useLogout } from '../auth/logout.hook.ts';

type AuthQueryOptions<TData, TSelected = TData> = Omit<
  UseQueryOptions<TData, AxiosError, TSelected>,
  'queryKey' | 'queryFn'
> & {
  queryKey: UseQueryOptions<TData, AxiosError, TSelected>['queryKey'];
  axiosConfig: AxiosRequestConfig;
};

export const useAuthQuery = <TData, TSelected = TData>({
  axiosConfig,
  queryKey,
  ...queryOptions
}: AuthQueryOptions<TData, TSelected>): UseQueryResult<
  TSelected,
  AxiosError
> => {
  const logout = useLogout();
  const refreshAuthTokens = useRefreshAuthTokens();

  const queryFn = async (): Promise<TData> => {
    return performAuthenticatedRequest<TData>(axiosConfig, {
      refreshAuthTokens,
      logout,
    });
  };

  return useQuery<TData, AxiosError, TSelected>({
    ...queryOptions,
    queryKey,
    queryFn,
  });
};
