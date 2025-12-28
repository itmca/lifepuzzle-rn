import { AxiosError } from 'axios';
import { CustomAlert } from '../../components/ui/feedback/CustomAlert.tsx';
import {
  showErrorToast,
  showToast,
} from '../../components/ui/feedback/Toast.tsx';

export const useErrorHandler = () => {
  const handleApiError = (
    error: AxiosError,
    errorMessage: string,
    retryFn?: () => void,
    cancelFn?: () => void,
  ) => {
    if (retryFn) {
      CustomAlert.retryAlert(errorMessage, retryFn, cancelFn || (() => {}));
    } else {
      CustomAlert.simpleAlert(errorMessage);
    }
  };

  const handleCreateError = (
    entityName: string,
    retryFn: () => void,
    cancelFn?: () => void,
  ) => {
    handleApiError(
      {} as AxiosError,
      `${entityName} 생성에 실패하였습니다.`,
      retryFn,
      cancelFn,
    );
  };

  const handleUpdateError = (
    entityName: string,
    retryFn: () => void,
    cancelFn?: () => void,
  ) => {
    handleApiError(
      {} as AxiosError,
      `${entityName} 수정이 실패했습니다.`,
      retryFn,
      cancelFn,
    );
  };

  const handleDeleteError = (entityName: string) => {
    showErrorToast(`${entityName} 삭제에 실패했습니다.`);
  };

  const showSuccessToast = (message: string) => {
    showToast(message);
  };

  const showSimpleAlert = (message: string) => {
    showErrorToast(message);
  };

  return {
    handleApiError,
    handleCreateError,
    handleUpdateError,
    handleDeleteError,
    showSuccessToast,
    showSimpleAlert,
  };
};
