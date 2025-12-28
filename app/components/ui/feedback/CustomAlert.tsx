import { Alert } from 'react-native';
import { showErrorToast } from './Toast';

export const CustomAlert = {
  simpleAlert: (title: string) => {
    showErrorToast(title);
  },
  retryAlert: (title: string, onRetry: () => void, onCancel: () => void) => {
    Alert.alert(title, '재시도 하시겠습니까?', [
      {
        text: '확인',
        onPress: () => {
          onRetry();
        },
      },
      {
        text: '취소',
        onPress: () => {
          onCancel();
        },
      },
    ]);
  },
  actionAlert: ({
    title,
    desc,
    actionBtnText,
    action,
  }: {
    title: string;
    desc: string;
    actionBtnText: string;
    action: () => void;
  }) => {
    Alert.alert(title, desc, [
      {
        text: actionBtnText,
        onPress: () => {
          action();
        },
      },
      {
        text: '취소',
        onPress: () => {},
      },
    ]);
  },
};
