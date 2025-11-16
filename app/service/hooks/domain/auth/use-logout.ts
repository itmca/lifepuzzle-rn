import {useCallback} from 'react';
import {useAuthStore} from '../../../../stores/auth.store';
import {LocalStorage} from '../../../local-storage.service';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../../../navigation/types';

export const useLogout = () => {
  const navigation = useNavigation<BasicNavigationProps>();
  const clearAuth = useAuthStore(state => state.clearAuth);

  const execute = useCallback(() => {
    // 로컬 스토리지 정리
    LocalStorage.delete('authToken');
    LocalStorage.delete('userNo');

    // 전역 상태 정리
    clearAuth();

    // 로그인 화면으로 이동
    navigation.reset({
      index: 0,
      routes: [{name: 'LoginPage'}],
    });
  }, [clearAuth, navigation]);

  return {
    execute,
  };
};
