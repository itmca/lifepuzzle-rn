import { Alert } from 'react-native';
import { useAuthStore } from '../../stores/auth.store.ts';
import { BasicNavigationProps } from '../../navigation/types.tsx';
import { CustomAlert } from '../../components/ui/feedback/CustomAlert.tsx';

export const useFieldValidation = () => {
  const validateRequired = (
    value: string | undefined,
    fieldName: string,
  ): boolean => {
    if (!value || value.trim() === '') {
      Alert.alert(`${fieldName}을(를) 입력해주세요.`);
      return false;
    }
    return true;
  };

  const validateMaxLength = (
    value: string | undefined,
    maxLength: number,
    fieldName: string,
  ): boolean => {
    if (value && value.length > maxLength) {
      Alert.alert(`${fieldName}은(는) ${maxLength}자 이내로 입력해주세요.`);
      return false;
    }
    return true;
  };

  const validateNickname = (nickname: string | undefined): boolean => {
    if (!validateRequired(nickname, '닉네임')) {
      return false;
    }
    return validateMaxLength(nickname, 8, '닉네임');
  };

  return {
    validateRequired,
    validateMaxLength,
    validateNickname,
  };
};

export const useAuthValidation = () => {
  const { isLoggedIn } = useAuthStore();
  const isUserLoggedIn = isLoggedIn();

  const validateLogin = (navigation: BasicNavigationProps): boolean => {
    if (!isUserLoggedIn) {
      Alert.alert(
        '미로그인 시점에 작성한 이야기는 저장할 수 없습니다.',
        '',
        [
          {
            text: '로그인하러가기',
            style: 'default',
            onPress: () => {
              navigation.navigate('Auth', {
                screen: 'LoginRegisterNavigator',
                params: {
                  screen: 'LoginMain',
                },
              });
            },
          },
          { text: '계속 둘러보기', style: 'default' },
        ],
        {
          cancelable: true,
        },
      );
      return false;
    }
    return true;
  };

  const showLoginAlert = (navigation: BasicNavigationProps) => {
    CustomAlert.simpleAlert('로그인이 필요한 기능입니다.');
  };

  return {
    validateLogin,
    showLoginAlert,
    isLoggedIn: isUserLoggedIn,
  };
};
