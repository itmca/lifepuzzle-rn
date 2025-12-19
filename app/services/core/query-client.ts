import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { logger } from '../../utils/logger.util';
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        const axiosError = error as AxiosError;
        // 401, 403은 재시도하지 않음 (인증 문제)
        if (
          axiosError.response?.status === 401 ||
          axiosError.response?.status === 403
        ) {
          return false;
        }
        // 최대 2번까지 재시도
        return failureCount < 2;
      },
      staleTime: 1000 * 60, // 1분
      gcTime: 1000 * 60 * 5, // 5분 (가비지 컬렉션 시간)
      refetchOnWindowFocus: false, // 윈도우 포커스 시 refetch 비활성화
      refetchOnReconnect: true, // 재연결 시 refetch 활성화
    },
    mutations: {
      retry: 0, // mutation은 재시도하지 않음
      onError: error => {
        logger.error('[React Query] Mutation error:', error);
      },
    },
  },
});
