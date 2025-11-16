import {AxiosError, AxiosRequestConfig} from 'axios';

// 표준화된 API 응답 타입
export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

// 페이지네이션 메타데이터
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// 페이지네이션된 응답
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

// API 클라이언트 설정
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// API 요청 옵션
export interface ApiRequestOptions extends Omit<AxiosRequestConfig, 'url'> {
  skipAuth?: boolean;
  retryCount?: number;
}

// 에러 타입 정의
export interface ApiError extends AxiosError {
  code?: string;
  context?: string;
}

// Hook 공통 파라미터
export interface BaseHookParams<TResponse, TError = ApiError> {
  onSuccess?: (data: TResponse) => void;
  onError?: (error: TError) => void;
  onLoadingChange?: (isLoading: boolean) => void;
  enabled?: boolean;
}

// CRUD 작업 타입
export type CrudOperation = 'create' | 'read' | 'update' | 'delete';

// 공통 엔티티 인터페이스
export interface BaseEntity {
  id: string | number;
  createdAt?: Date;
  updatedAt?: Date;
}
