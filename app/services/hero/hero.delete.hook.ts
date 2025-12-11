import { useHeroStore } from '../../stores/hero.store.ts';
import { useNavigation } from '@react-navigation/native';
import { BasicNavigationProps } from '../../navigation/types.tsx';
import { useAuthMutation } from '../core/auth-mutation.hook.ts';
import {
  showErrorToast,
  showToast,
} from '../../components/ui/feedback/Toast.tsx';

export const useDeleteHero = (): [() => void, boolean] => {
  const navigation = useNavigation<BasicNavigationProps>();
  const writingHero = useHeroStore(state => state.writingHero);

  const [isLoading, deleteHero] = useAuthMutation<any>({
    axiosConfig: {
      url: `/v1/heroes/${writingHero?.id}`,
      method: 'delete',
    },
    onSuccess: () => {
      showToast(`${writingHero?.name}이 삭제되었습니다.`);
      // 주인공 관리 화면으로 이동
      navigation.navigate('App', {
        screen: 'HeroSettingNavigator',
        params: {
          screen: 'HeroSetting',
        },
      });
    },
    onError: _err => {
      showErrorToast(
        `${writingHero.name} 삭제를 실패했습니다.\n잠시 후 다시 시도 부탁드립니다.`,
      );
    },
  });

  return [() => void deleteHero({}), isLoading];
};
