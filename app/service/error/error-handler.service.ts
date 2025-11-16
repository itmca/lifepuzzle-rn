import {Alert} from 'react-native';
import {ApiError} from '../../types/api/common.type';
import {CustomAlert} from '../../components/ui/feedback/CustomAlert';
import {showErrorToast, showToast} from '../../components/ui/feedback/Toast';

// 에러 메시지 상수
export const ERROR_MESSAGES = {
  NETWORK: '네트워크 연결을 확인해주세요.',
  TIMEOUT: '요청 시간이 초과되었습니다.',
  SERVER: '서버 오류가 발생했습니다.',
  UNAUTHORIZED: '로그인이 필요합니다.',
  FORBIDDEN: '권한이 없습니다.',
  NOT_FOUND: '요청한 리소스를 찾을 수 없습니다.',
  VALIDATION: '입력 값을 확인해주세요.',
  UNKNOWN: '알 수 없는 오류가 발생했습니다.',
} as const;

// CRUD 작업별 에러 메시지
export const CRUD_ERROR_MESSAGES = {
  create: (entityName: string) => `${entityName} 생성에 실패하였습니다.`,
  read: (entityName: string) => `${entityName} 조회에 실패하였습니다.`,
  update: (entityName: string) => `${entityName} 수정이 실패했습니다.`,
  delete: (entityName: string) => `${entityName} 삭제에 실패했습니다.`,
} as const;

// 에러 타입 판별 함수들
export const errorTypeCheckers = {
  isNetworkError: (error: ApiError): boolean =>
    !error.response && error.code === 'NETWORK_ERROR',
  isTimeoutError: (error: ApiError): boolean => error.code === 'ECONNABORTED',
  isServerError: (error: ApiError): boolean => {
    const status = error.response?.status;
    return status ? status >= 500 : false;
  },
  isClientError: (error: ApiError): boolean => {
    const status = error.response?.status;
    return status ? status >= 400 && status < 500 : false;
  },
  isUnauthorized: (error: ApiError): boolean => error.response?.status === 401,
  isForbidden: (error: ApiError): boolean => error.response?.status === 403,
  isNotFound: (error: ApiError): boolean => error.response?.status === 404,
  isValidationError: (error: ApiError): boolean =>
    error.response?.status === 422,
} as const;

// 에러 메시지 추출 함수
export const getErrorMessage = (error: ApiError): string => {
  if (errorTypeCheckers.isNetworkError(error)) {
    return ERROR_MESSAGES.NETWORK;
  }

  if (errorTypeCheckers.isTimeoutError(error)) {
    return ERROR_MESSAGES.TIMEOUT;
  }

  if (errorTypeCheckers.isUnauthorized(error)) {
    return ERROR_MESSAGES.UNAUTHORIZED;
  }

  if (errorTypeCheckers.isForbidden(error)) {
    return ERROR_MESSAGES.FORBIDDEN;
  }

  if (errorTypeCheckers.isNotFound(error)) {
    return ERROR_MESSAGES.NOT_FOUND;
  }

  if (errorTypeCheckers.isValidationError(error)) {
    return ERROR_MESSAGES.VALIDATION;
  }

  if (errorTypeCheckers.isServerError(error)) {
    return ERROR_MESSAGES.SERVER;
  }

  // API에서 반환한 에러 메시지 사용
  const responseMessage = error.response?.data?.message;
  if (responseMessage) {
    return responseMessage;
  }

  return ERROR_MESSAGES.UNKNOWN;
};

// 에러 핸들링 함수들
export const errorHandlers = {
  // API 에러 기본 처리
  handleApiError: (
    error: ApiError,
    customMessage?: string,
    retryFn?: () => void,
    cancelFn?: () => void,
  ) => {
    const message = customMessage || getErrorMessage(error);

    if (retryFn) {
      CustomAlert.retryAlert(message, retryFn, cancelFn);
    } else {
      CustomAlert.simpleAlert(message);
    }
  },

  // CRUD 작업 에러 처리
  handleCrudError: (
    operation: keyof typeof CRUD_ERROR_MESSAGES,
    entityName: string,
    error: ApiError,
    retryFn?: () => void,
    cancelFn?: () => void,
  ) => {
    const message = CRUD_ERROR_MESSAGES[operation](entityName);
    errorHandlers.handleApiError(error, message, retryFn, cancelFn);
  },

  // 생성 에러 처리
  handleCreateError: (
    entityName: string,
    error: ApiError,
    retryFn?: () => void,
    cancelFn?: () => void,
  ) => {
    errorHandlers.handleCrudError(
      'create',
      entityName,
      error,
      retryFn,
      cancelFn,
    );
  },

  // 수정 에러 처리
  handleUpdateError: (
    entityName: string,
    error: ApiError,
    retryFn?: () => void,
    cancelFn?: () => void,
  ) => {
    errorHandlers.handleCrudError(
      'update',
      entityName,
      error,
      retryFn,
      cancelFn,
    );
  },

  // 삭제 에러 처리 (토스트로)
  handleDeleteError: (entityName: string, error: ApiError) => {
    const message = CRUD_ERROR_MESSAGES.delete(entityName);
    showErrorToast(message);
  },

  // 성공 토스트
  showSuccessToast: (message: string) => {
    showToast(message);
  },

  // 간단한 알림
  showSimpleAlert: (message: string) => {
    Alert.alert(message);
  },
} as const;

// Hook에서 사용할 에러 핸들러 생성 함수
export const createErrorHandler = (entityName?: string) => {
  return {
    handleApiError: (
      error: ApiError,
      retryFn?: () => void,
      cancelFn?: () => void,
    ) => errorHandlers.handleApiError(error, undefined, retryFn, cancelFn),

    handleCreateError: (
      error: ApiError,
      retryFn?: () => void,
      cancelFn?: () => void,
    ) =>
      entityName
        ? errorHandlers.handleCreateError(entityName, error, retryFn, cancelFn)
        : errorHandlers.handleApiError(error, undefined, retryFn, cancelFn),

    handleUpdateError: (
      error: ApiError,
      retryFn?: () => void,
      cancelFn?: () => void,
    ) =>
      entityName
        ? errorHandlers.handleUpdateError(entityName, error, retryFn, cancelFn)
        : errorHandlers.handleApiError(error, undefined, retryFn, cancelFn),

    handleDeleteError: (error: ApiError) =>
      entityName
        ? errorHandlers.handleDeleteError(entityName, error)
        : errorHandlers.handleApiError(error),

    showSuccessToast: errorHandlers.showSuccessToast,
    showSimpleAlert: errorHandlers.showSimpleAlert,
  };
};
