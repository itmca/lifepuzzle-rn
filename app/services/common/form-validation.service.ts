import { Alert } from 'react-native';
import { CustomAlert } from '../../components/ui/feedback/CustomAlert.tsx';

/**
 * 폼 검증을 위한 공통 서비스
 * Alert와 CustomAlert를 사용하여 사용자에게 검증 결과를 표시합니다.
 */
export const FormValidationService = {
  /**
   * 필수 필드 검증
   * @param value 검증할 값
   * @param fieldName 필드명
   * @returns 검증 성공 여부
   */
  validateRequired(value: string | undefined, fieldName: string): boolean {
    if (!value || value.trim() === '') {
      Alert.alert(`${fieldName}을(를) 입력해주세요.`);
      return false;
    }
    return true;
  },

  /**
   * 최대 길이 검증
   * @param value 검증할 값
   * @param maxLength 최대 길이
   * @param fieldName 필드명
   * @returns 검증 성공 여부
   */
  validateMaxLength(
    value: string | undefined,
    maxLength: number,
    fieldName: string,
  ): boolean {
    if (value && value.length > maxLength) {
      Alert.alert(`${fieldName}은(는) ${maxLength}자 이내로 입력해주세요.`);
      return false;
    }
    return true;
  },

  /**
   * 닉네임 검증 (필수 + 최대 8자)
   * @param nickname 닉네임
   * @returns 검증 성공 여부
   */
  validateNickname(nickname: string | undefined): boolean {
    if (!this.validateRequired(nickname, '닉네임')) {
      return false;
    }
    return this.validateMaxLength(nickname, 8, '닉네임');
  },

  /**
   * 여러 필드를 순차적으로 검증
   * @param validations 검증 함수 배열
   * @returns 모든 검증 성공 여부
   */
  validateAll(...validations: (() => boolean)[]): boolean {
    for (const validation of validations) {
      if (!validation()) {
        return false;
      }
    }
    return true;
  },

  /**
   * CustomAlert를 사용한 간단한 경고
   * @param message 메시지
   */
  showAlert(message: string): void {
    CustomAlert.simpleAlert(message);
  },
} as const;
