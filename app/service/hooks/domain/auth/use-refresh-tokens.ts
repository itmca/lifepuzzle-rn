import {useCallback, useState} from 'react';
import {useAuthStore} from '../../../../stores/auth.store';
import {useBaseApi} from '../../core/use-api';
import {AuthTokens} from '../../../../types/auth/auth.type';
import {LocalStorage} from '../../../local-storage.service';
import {createErrorHandler} from '../../../error/error-handler.service';

interface RefreshParams {
  onRefreshSuccess: (tokens: AuthTokens) => void;
}

export const useRefreshAuthTokens = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const authTokens = useAuthStore(state => state.authTokens);
  const setAuthTokens = useAuthStore(state => state.setAuthTokens);
  const baseApi = useBaseApi();
  const errorHandler = createErrorHandler('토큰');

  const execute = useCallback(
    async (params: RefreshParams) => {
      if (isRefreshing) {
        return; // 이미 갱신 중이면 중복 요청 방지
      }

      try {
        setIsRefreshing(true);

        if (!authTokens?.refreshToken) {
          throw new Error('Refresh token not available');
        }

        const response = await baseApi.post<AuthTokens>('/v1/auth/refresh', {
          refreshToken: authTokens.refreshToken,
        });

        // 새 토큰 저장
        setAuthTokens(response);
        LocalStorage.set('authToken', JSON.stringify(response));

        params.onRefreshSuccess(response);
      } catch (error) {
        errorHandler.handleApiError(error as any);
        // 리프레시 실패 시 로그아웃 처리는 상위에서 처리
        throw error;
      } finally {
        setIsRefreshing(false);
      }
    },
    [isRefreshing, authTokens, setAuthTokens, baseApi, errorHandler],
  );

  return {
    execute,
    isRefreshing,
  };
};
