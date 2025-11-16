import {AxiosRequestConfig} from 'axios';
import {createApiClient, createBaseApiService} from './base-api.service';
import {AuthTokens, TokenState} from '../../types/auth/auth.type';
import {getTokenState} from '../auth.service';
import {ApiRequestOptions} from '../../types/api/common.type';

export interface AuthApiConfig {
  getTokens: () => AuthTokens | null;
  refreshTokens: (params: {
    onRefreshSuccess: (tokens: AuthTokens) => void;
  }) => void;
  logout: () => void;
}

export const createAuthenticatedApiService = (authConfig: AuthApiConfig) => {
  // 인증용 클라이언트 생성
  const authClient = createApiClient();
  const baseService = createBaseApiService(authClient);

  // 토큰 관리 함수들
  const validateAndRefreshTokens = async (
    tokens: AuthTokens | null,
  ): Promise<AuthTokens | null> => {
    if (!tokens) {
      authConfig.logout();
      return null;
    }

    const tokenState: TokenState = getTokenState(tokens);

    switch (tokenState) {
      case 'Use':
        return tokens;

      case 'Refresh':
        return new Promise(resolve => {
          authConfig.refreshTokens({
            onRefreshSuccess: refreshedTokens => resolve(refreshedTokens),
          });
        });

      case 'Expire':
        authConfig.logout();
        return null;

      default:
        return null;
    }
  };

  // 인증 헤더 추가 함수
  const addAuthHeaders = (
    config: AxiosRequestConfig,
    tokens: AuthTokens,
  ): AxiosRequestConfig => {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    };
  };

  // 인증된 요청 래퍼
  const authenticatedRequest = async <T>(
    requestFn: (config: AxiosRequestConfig) => Promise<T>,
    config: AxiosRequestConfig & ApiRequestOptions,
  ): Promise<T> => {
    // 인증을 건너뛸 경우
    if (config.skipAuth) {
      return requestFn(config);
    }

    const tokens = authConfig.getTokens();
    const validTokens = await validateAndRefreshTokens(tokens);

    if (!validTokens) {
      throw new Error('Authentication failed');
    }

    const authenticatedConfig = addAuthHeaders(config, validTokens);
    return requestFn(authenticatedConfig);
  };

  // 인증된 API 메서드들
  const authenticatedApi = {
    get: async <T>(
      url: string,
      options: ApiRequestOptions = {},
    ): Promise<T> => {
      return authenticatedRequest(config => baseService.get<T>(url, config), {
        url,
        ...options,
      });
    },

    post: async <T>(
      url: string,
      data?: any,
      options: ApiRequestOptions = {},
    ): Promise<T> => {
      return authenticatedRequest(
        config => baseService.post<T>(url, data, config),
        {url, data, ...options},
      );
    },

    put: async <T>(
      url: string,
      data?: any,
      options: ApiRequestOptions = {},
    ): Promise<T> => {
      return authenticatedRequest(
        config => baseService.put<T>(url, data, config),
        {url, data, ...options},
      );
    },

    patch: async <T>(
      url: string,
      data?: any,
      options: ApiRequestOptions = {},
    ): Promise<T> => {
      return authenticatedRequest(
        config => baseService.patch<T>(url, data, config),
        {url, data, ...options},
      );
    },

    delete: async <T>(
      url: string,
      options: ApiRequestOptions = {},
    ): Promise<T> => {
      return authenticatedRequest(
        config => baseService.delete<T>(url, config),
        {url, ...options},
      );
    },

    // 기본 서비스도 제공 (인증이 필요 없는 요청용)
    ...baseService,
  };

  return authenticatedApi;
};
