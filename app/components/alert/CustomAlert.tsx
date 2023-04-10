import {Alert} from 'react-native';

export const CustomAlert = {
  simpleAlert: (title: string) => {
    Alert.alert(title);
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
  actionAlert: (actionName: string, desc: string, action: () => void) => {
    Alert.alert(actionName, desc, [
      {
        text: actionName,
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
