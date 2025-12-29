import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { HttpService } from './http.service.ts';

type HttpQueryOptions<TData, TSelected = TData> = {
  queryKey: UseQueryOptions<TData, AxiosError, TSelected>['queryKey'];
  axiosConfig: AxiosRequestConfig;
  enabled?: boolean;
  staleTime?: number;
  retry?: number | boolean;
  onSuccess?: (data: TData) => void;
  onError?: (error: AxiosError) => void;
} & Omit<
  UseQueryOptions<TData, AxiosError, TSelected>,
  | 'queryKey'
  | 'queryFn'
  | 'enabled'
  | 'staleTime'
  | 'retry'
  | 'onSuccess'
  | 'onError'
>;

/**
 * 인증이 필요하지 않은 GET 요청을 위한 Query Hook
 * 인증이 필요한 GET 요청은 useAuthQuery를 사용하세요.
 *
 * @example
 * const { data, isLoading } = useHttpQuery<{ isDuplicated: boolean }>({
 *   queryKey: ['users', 'dupcheck', id],
 *   axiosConfig: {
 *     url: '/v1/users/dupcheck/id',
 *     method: 'get',
 *     params: { id },
 *   },
 *   enabled: !!id && id.length >= 3,
 * });
 */
export const useHttpQuery = <TData, TSelected = TData>({
  axiosConfig,
  queryKey,
  onSuccess,
  onError,
  ...queryOptions
}: HttpQueryOptions<TData, TSelected>): UseQueryResult<
  TSelected,
  AxiosError
> => {
  const queryFn = async (): Promise<TData> => {
    const client = HttpService.createAxiosInstance();
    const preparedConfig = HttpService.prepareRequestConfig(axiosConfig);

    try {
      const response = await client.request<TData>(preparedConfig);
      const data = response.data;

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(data);
      }

      return data;
    } catch (error) {
      // Call onError callback if provided
      if (onError && error instanceof Error) {
        onError(error as AxiosError);
      }
      throw error;
    }
  };

  return useQuery<TData, AxiosError, TSelected>({
    ...queryOptions,
    queryKey,
    queryFn,
  });
};
