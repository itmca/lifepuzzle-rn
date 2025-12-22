import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../stores/auth.store';
import { BasicNavigationProps } from '../../navigation/types';
import { WritingHeroType } from '../../types/core/hero.type';
import { CustomAlert } from '../../components/ui/feedback/CustomAlert';

export type UseHeroFormValidationReturn = {
  validateHeroForm: (writingHero?: WritingHeroType) => boolean;
};

/**
 * Hero 폼 validation을 위한 공통 hook
 * useCreateHero와 useUpdateHero에서 공통으로 사용
 */
export const useHeroFormValidation = (): UseHeroFormValidationReturn => {
  const navigation = useNavigation<BasicNavigationProps>();
  const isLoggedIn = useAuthStore(state => state.isLoggedIn());

  const validateHeroForm = useCallback(
    (writingHero?: WritingHeroType): boolean => {
      if (!writingHero?.name) {
        CustomAlert.simpleAlert('이름을 입력해주세요.');
        return false;
      }

      if (!writingHero?.nickName) {
        CustomAlert.simpleAlert('닉네임을 입력해주세요.');
        return false;
      }

      if (!writingHero?.birthday) {
        CustomAlert.simpleAlert('태어난 날을 입력해주세요.');
        return false;
      }

      if (!isLoggedIn) {
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
    },
    [isLoggedIn, navigation],
  );

  return { validateHeroForm };
};
