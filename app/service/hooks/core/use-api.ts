import {useMemo} from 'react';
import {
  createAuthenticatedApiService,
  AuthApiConfig,
} from '../../api/authenticated-api.service';
import {baseApiService} from '../../api/base-api.service';
import {useAuthStore} from '../../../stores/auth.store';
import {useRefreshAuthTokens} from '../domain/auth/use-refresh-tokens';
import {useLogout} from '../domain/auth/use-logout';

/**
 * 인증이 필요한 API 호출을 위한 훅
 */
export const useAuthenticatedApi = () => {
  const authTokens = useAuthStore(state => state.authTokens);
  const refreshTokens = useRefreshAuthTokens();
  const logout = useLogout();

  const authenticatedApiService = useMemo(() => {
    const authConfig: AuthApiConfig = {
      getTokens: () => authTokens,
      refreshTokens: refreshTokens.execute,
      logout: logout.execute,
    };

    return createAuthenticatedApiService(authConfig);
  }, [authTokens, refreshTokens.execute, logout.execute]);

  return authenticatedApiService;
};

/**
 * 기본 API 호출을 위한 훅 (인증 불필요)
 */
export const useBaseApi = () => {
  return baseApiService;
};

/**
 * API 서비스 통합 훅
 * @param requireAuth 인증 여부 (기본값: true)
 */
export const useApi = (requireAuth = true) => {
  const authenticatedApi = useAuthenticatedApi();
  const baseApi = useBaseApi();

  return requireAuth ? authenticatedApi : baseApi;
};
