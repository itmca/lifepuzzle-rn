import {useCallback, useState, useEffect} from 'react';
import {AxiosRequestConfig} from 'axios';
import {
  BaseHookParams,
  ApiRequestOptions,
  ApiError,
  BaseEntity,
} from '../../../types/api/common.type';
import {createErrorHandler} from '../../error/error-handler.service';

// Hook 팩토리 설정 인터페이스
export interface ApiHookConfig<TResponse, TRequest = unknown>
  extends BaseHookParams<TResponse> {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  initialData?: TRequest;
  entityName?: string;
  enabledByDefault?: boolean;
}

// API Hook 반환 타입
export interface ApiHookReturn<TResponse, TRequest = unknown> {
  data: TResponse | undefined;
  loading: boolean;
  error: ApiError | undefined;
  execute: (
    params?: Partial<TRequest> & {options?: ApiRequestOptions},
  ) => Promise<void>;
  reset: () => void;
}

// CRUD Hook 설정
export interface CrudHookConfig<T extends BaseEntity>
  extends BaseHookParams<T> {
  endpoint: string;
  entityName: string;
}

// CRUD Hook 반환 타입
export interface CrudHookReturn<
  T extends BaseEntity,
  TCreate = Omit<T, 'id'>,
  TUpdate = Partial<T>,
> {
  // Read operations
  item: T | undefined;
  items: T[];
  loading: boolean;
  error: ApiError | undefined;

  // CRUD operations
  fetchItem: (id: string | number) => Promise<void>;
  fetchItems: () => Promise<void>;
  createItem: (data: TCreate) => Promise<void>;
  updateItem: (id: string | number, data: TUpdate) => Promise<void>;
  deleteItem: (id: string | number) => Promise<void>;

  // Utility
  reset: () => void;
}

// Generic API Hook Factory
export const createApiHook = <TResponse, TRequest = unknown>(
  apiService: any, // API 서비스 함수
  config: ApiHookConfig<TResponse, TRequest>,
): (() => ApiHookReturn<TResponse, TRequest>) => {
  return () => {
    const [data, setData] = useState<TResponse | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError | undefined>(undefined);

    const errorHandler = createErrorHandler(config.entityName);

    const execute = useCallback(
      async (params?: Partial<TRequest> & {options?: ApiRequestOptions}) => {
        try {
          setLoading(true);
          setError(undefined);
          config.onLoadingChange?.(true);

          const requestConfig: AxiosRequestConfig = {
            url: config.url,
            method: config.method || 'GET',
            ...(params?.options || {}),
          };

          // 데이터가 있으면 추가
          if (params && Object.keys(params).length > 0 && !params.options) {
            if (config.method === 'GET') {
              requestConfig.params = params;
            } else {
              requestConfig.data = params;
            }
          }

          const result = await apiService.request<TResponse>(requestConfig);

          setData(result);
          config.onSuccess?.(result);
        } catch (err) {
          const apiError = err as ApiError;
          setError(apiError);

          if (config.onError) {
            config.onError(apiError);
          } else {
            errorHandler.handleApiError(apiError);
          }
        } finally {
          setLoading(false);
          config.onLoadingChange?.(false);
        }
      },
      [apiService, config, errorHandler],
    );

    const reset = useCallback(() => {
      setData(undefined);
      setError(undefined);
      setLoading(false);
    }, []);

    // 초기 로딩
    useEffect(() => {
      if (
        config.enabled !== false &&
        config.enabledByDefault !== false &&
        config.method !== 'POST'
      ) {
        execute();
      }
    }, [execute, config.enabled, config.enabledByDefault, config.method]);

    return {
      data,
      loading,
      error,
      execute,
      reset,
    };
  };
};

// CRUD Hook Factory
export const createCrudHook = <
  T extends BaseEntity,
  TCreate = Omit<T, 'id'>,
  TUpdate = Partial<T>,
>(
  apiService: any,
  config: CrudHookConfig<T>,
): (() => CrudHookReturn<T, TCreate, TUpdate>) => {
  return () => {
    const [item, setItem] = useState<T | undefined>(undefined);
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError | undefined>(undefined);

    const errorHandler = createErrorHandler(config.entityName);

    const setLoadingState = useCallback(
      (isLoading: boolean) => {
        setLoading(isLoading);
        config.onLoadingChange?.(isLoading);
      },
      [config],
    );

    const handleError = useCallback(
      (err: ApiError) => {
        setError(err);
        if (config.onError) {
          config.onError(err);
        }
      },
      [config],
    );

    const fetchItem = useCallback(
      async (id: string | number) => {
        try {
          setLoadingState(true);
          setError(undefined);

          const result = await apiService.get<T>(`${config.endpoint}/${id}`);
          setItem(result);
          config.onSuccess?.(result);
        } catch (err) {
          handleError(err as ApiError);
          errorHandler.handleApiError(err as ApiError);
        } finally {
          setLoadingState(false);
        }
      },
      [apiService, config, errorHandler, setLoadingState, handleError],
    );

    const fetchItems = useCallback(async () => {
      try {
        setLoadingState(true);
        setError(undefined);

        const result = await apiService.get<T[]>(config.endpoint);
        setItems(result);
      } catch (err) {
        handleError(err as ApiError);
        errorHandler.handleApiError(err as ApiError);
      } finally {
        setLoadingState(false);
      }
    }, [apiService, config, errorHandler, setLoadingState, handleError]);

    const createItem = useCallback(
      async (data: TCreate) => {
        try {
          setLoadingState(true);
          setError(undefined);

          const result = await apiService.post<T>(config.endpoint, data);
          setItems(prev => [...prev, result]);
          errorHandler.showSuccessToast(
            `${config.entityName} 생성이 완료되었습니다.`,
          );
          config.onSuccess?.(result);
        } catch (err) {
          handleError(err as ApiError);
          errorHandler.handleCreateError(err as ApiError);
        } finally {
          setLoadingState(false);
        }
      },
      [apiService, config, errorHandler, setLoadingState, handleError],
    );

    const updateItem = useCallback(
      async (id: string | number, data: TUpdate) => {
        try {
          setLoadingState(true);
          setError(undefined);

          const result = await apiService.put<T>(
            `${config.endpoint}/${id}`,
            data,
          );
          setItems(prev => prev.map(item => (item.id === id ? result : item)));
          if (item?.id === id) {
            setItem(result);
          }
          errorHandler.showSuccessToast(
            `${config.entityName} 수정이 완료되었습니다.`,
          );
          config.onSuccess?.(result);
        } catch (err) {
          handleError(err as ApiError);
          errorHandler.handleUpdateError(err as ApiError);
        } finally {
          setLoadingState(false);
        }
      },
      [apiService, config, errorHandler, setLoadingState, handleError, item],
    );

    const deleteItem = useCallback(
      async (id: string | number) => {
        try {
          setLoadingState(true);
          setError(undefined);

          await apiService.delete(`${config.endpoint}/${id}`);
          setItems(prev => prev.filter(item => item.id !== id));
          if (item?.id === id) {
            setItem(undefined);
          }
          errorHandler.showSuccessToast(
            `${config.entityName} 삭제가 완료되었습니다.`,
          );
        } catch (err) {
          handleError(err as ApiError);
          errorHandler.handleDeleteError(err as ApiError);
        } finally {
          setLoadingState(false);
        }
      },
      [apiService, config, errorHandler, setLoadingState, handleError, item],
    );

    const reset = useCallback(() => {
      setItem(undefined);
      setItems([]);
      setError(undefined);
      setLoading(false);
    }, []);

    return {
      item,
      items,
      loading,
      error,
      fetchItem,
      fetchItems,
      createItem,
      updateItem,
      deleteItem,
      reset,
    };
  };
};
