import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {SERVER_HOST} from '../../constants/url.constant';
import {convertDateStringToDate} from '../json-convert.service';
import {
  ApiClientConfig,
  ApiRequestOptions,
  ApiError,
} from '../../types/api/common.type';
import logger from '../../utils/logger';

// API 클라이언트 생성 함수
export const createApiClient = (config: Partial<ApiClientConfig> = {}) => {
  const client: AxiosInstance = axios.create({
    baseURL: config.baseURL || SERVER_HOST,
    timeout: config.timeout || 5000,
    headers: {
      'Content-Type': 'application/json',
      ...config.headers,
    },
  });

  // 요청 인터셉터
  client.interceptors.request.use(
    requestConfig => {
      logger.debug(
        `API Request: ${requestConfig.method?.toUpperCase()} ${requestConfig.url}`,
      );
      return requestConfig;
    },
    error => Promise.reject(error),
  );

  // 응답 인터셉터
  client.interceptors.response.use(
    <T>(response: AxiosResponse<T>) => {
      return convertDateStringToDate(response);
    },
    error => {
      const apiError: ApiError = {
        ...error,
        context: 'base-api',
      };
      return Promise.reject(apiError);
    },
  );

  return client;
};

// Base API 서비스 함수들
export const createBaseApiService = (client: AxiosInstance) => {
  const request = async <T>(
    config: AxiosRequestConfig & ApiRequestOptions,
  ): Promise<T> => {
    try {
      const response = await client.request<T>(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const get = async <T>(
    url: string,
    options: ApiRequestOptions = {},
  ): Promise<T> => {
    return request<T>({
      method: 'GET',
      url,
      ...options,
    });
  };

  const post = async <T>(
    url: string,
    data?: any,
    options: ApiRequestOptions = {},
  ): Promise<T> => {
    return request<T>({
      method: 'POST',
      url,
      data,
      ...options,
    });
  };

  const put = async <T>(
    url: string,
    data?: any,
    options: ApiRequestOptions = {},
  ): Promise<T> => {
    return request<T>({
      method: 'PUT',
      url,
      data,
      ...options,
    });
  };

  const patch = async <T>(
    url: string,
    data?: any,
    options: ApiRequestOptions = {},
  ): Promise<T> => {
    return request<T>({
      method: 'PATCH',
      url,
      data,
      ...options,
    });
  };

  const del = async <T>(
    url: string,
    options: ApiRequestOptions = {},
  ): Promise<T> => {
    return request<T>({
      method: 'DELETE',
      url,
      ...options,
    });
  };

  return {
    request,
    get,
    post,
    put,
    patch,
    delete: del,
    client,
  };
};

// 기본 API 클라이언트 인스턴스
export const defaultApiClient = createApiClient();
export const baseApiService = createBaseApiService(defaultApiClient);
