import {useCallback} from 'react';
import {Alert} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import {useAuthStore} from '../../../stores/auth.store';
import {getTokenState} from '../../auth.service';

export type ValidationRule<T = any> = (value: T) => boolean | string;

/**
 * 필드 유효성 검사를 위한 Hook
 */
export const useFieldValidation = () => {
  const validateRequired = useCallback(
    (value: any, fieldName: string): boolean => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        Alert.alert(`${fieldName}은(는) 필수입니다.`);
        return false;
      }
      return true;
    },
    [],
  );

  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('올바른 이메일 형식이 아닙니다.');
      return false;
    }
    return true;
  }, []);

  const validateMinLength = useCallback(
    (value: string, minLength: number, fieldName: string): boolean => {
      if (value.length < minLength) {
        Alert.alert(
          `${fieldName}은(는) 최소 ${minLength}자 이상이어야 합니다.`,
        );
        return false;
      }
      return true;
    },
    [],
  );

  const validateMaxLength = useCallback(
    (value: string, maxLength: number, fieldName: string): boolean => {
      if (value.length > maxLength) {
        Alert.alert(`${fieldName}은(는) 최대 ${maxLength}자 이하여야 합니다.`);
        return false;
      }
      return true;
    },
    [],
  );

  const validatePhone = useCallback((phone: string): boolean => {
    const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;
    if (!phoneRegex.test(phone.replace(/-/g, ''))) {
      Alert.alert('올바른 휴대폰 번호 형식이 아닙니다.');
      return false;
    }
    return true;
  }, []);

  const validateCustom = useCallback(
    <T>(value: T, rule: ValidationRule<T>): boolean => {
      const result = rule(value);
      if (typeof result === 'string') {
        Alert.alert(result);
        return false;
      }
      return result;
    },
    [],
  );

  return {
    validateRequired,
    validateEmail,
    validateMinLength,
    validateMaxLength,
    validatePhone,
    validateCustom,
  };
};

/**
 * 인증 상태 유효성 검사를 위한 Hook
 */
export const useAuthValidation = () => {
  const authTokens = useAuthStore(state => state.authTokens);

  const validateLogin = useCallback(
    (navigation?: NavigationProp<any>): boolean => {
      if (!authTokens) {
        Alert.alert(
          '로그인이 필요합니다',
          '로그인 페이지로 이동하시겠습니까?',
          [
            {text: '취소', style: 'cancel'},
            {
              text: '이동',
              onPress: () => navigation?.navigate('LoginPage'),
            },
          ],
        );
        return false;
      }

      const tokenState = getTokenState(authTokens);
      if (tokenState === 'Expire') {
        Alert.alert('세션이 만료되었습니다', '다시 로그인해주세요.', [
          {
            text: '확인',
            onPress: () => navigation?.navigate('LoginPage'),
          },
        ]);
        return false;
      }

      return true;
    },
    [authTokens],
  );

  return {
    validateLogin,
    isAuthenticated: !!authTokens && getTokenState(authTokens) !== 'Expire',
  };
};
