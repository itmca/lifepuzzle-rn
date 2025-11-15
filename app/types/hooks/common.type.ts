import {AxiosError, AxiosRequestConfig} from 'axios';

// Generic hook return type for API operations
export type ApiHookReturn<T = void> = [
  boolean, // isLoading
  (requestConfig?: Partial<AxiosRequestConfig>) => void, // trigger function
  T | undefined, // data (optional)
  AxiosError | undefined, // error (optional)
];

// Generic hook parameters for API operations
export type ApiHookParams<TResponse, TError = AxiosError> = {
  requestOption: AxiosRequestConfig;
  onResponseSuccess: (data: TResponse) => void;
  onError?: (error: TError) => void;
  onLoadingStatusChange?: (isLoading: boolean) => void;
  disableInitialRequest?: boolean;
};

// Generic validation function type
export type ValidationFunction<T> = (value: T) => boolean;

// Generic form submission hook type
export type FormSubmissionHook<TData> = {
  isLoading: boolean;
  submit: (data: TData) => void;
  validate: () => boolean;
  reset: () => void;
};

// Common entity operations
export type EntityOperation = 'create' | 'read' | 'update' | 'delete';

// Generic CRUD hook parameters
export type CrudHookParams<
  TEntity,
  TCreateData = TEntity,
  TUpdateData = Partial<TEntity>,
> = {
  create?: {
    onSuccess?: (entity: TEntity) => void;
    onError?: (error: AxiosError) => void;
  };
  update?: {
    onSuccess?: (entity: TEntity) => void;
    onError?: (error: AxiosError) => void;
  };
  delete?: {
    onSuccess?: () => void;
    onError?: (error: AxiosError) => void;
  };
};
