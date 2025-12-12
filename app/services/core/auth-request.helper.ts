import { AxiosRequestConfig } from 'axios';
import { getTokenState } from './auth.service.ts';
import { useLogout } from '../auth/logout.hook.ts';
import { useRefreshAuthTokens } from '../auth/refresh.hook.ts';
import { HttpService } from './http.service.ts';
import { useAuthStore } from '../../stores/auth.store.ts';

type RequestDeps = {
  refreshAuthTokens: ReturnType<typeof useRefreshAuthTokens>;
  logout: ReturnType<typeof useLogout>;
};

export const performAuthenticatedRequest = async <TResponse>(
  axiosConfig: AxiosRequestConfig,
  { refreshAuthTokens, logout }: RequestDeps,
): Promise<TResponse> => {
  const tokens = useAuthStore.getState().authTokens;
  const tokenState = getTokenState(tokens);

  if (tokenState === 'Expire') {
    logout();
    throw new Error('Token expired');
  }

  if (tokenState === 'Refresh') {
    if (!tokens.refreshToken) {
      logout();
      throw new Error('Refresh token missing');
    }

    return new Promise<TResponse>((resolve, reject) => {
      refreshAuthTokens({
        onRefreshSuccess: refreshedTokens => {
          performAuthenticatedRequest<TResponse>(
            {
              ...axiosConfig,
              headers: {
                Authorization:
                  refreshedTokens.accessToken &&
                  `Bearer ${refreshedTokens.accessToken}`,
                ...axiosConfig.headers,
              },
            },
            { refreshAuthTokens, logout },
          )
            .then(resolve)
            .catch(reject);
        },
        onError: error => {
          reject(error);
        },
      });
    });
  }

  const client = HttpService.createAxiosInstance();
  const preparedConfig = HttpService.prepareRequestConfig({
    ...axiosConfig,
    headers: {
      Authorization: tokens.accessToken && `Bearer ${tokens.accessToken}`,
      ...axiosConfig.headers,
    },
  });

  return client.request<TResponse>(preparedConfig).then(r => r.data);
};
