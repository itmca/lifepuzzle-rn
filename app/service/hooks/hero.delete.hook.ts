import {useRecoilValue} from 'recoil';
import {writingHeroState} from '../../recoils/hero-write.recoil';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';
import {useAuthAxios} from './network.hook.ts';
import {
  showErrorToast,
  showToast,
} from '../../components/styled/components/Toast.tsx';

export const useDeleteHero = (): [() => void, boolean] => {
  const navigation = useNavigation<BasicNavigationProps>();
  const writingHero = useRecoilValue(writingHeroState);

  const [isLoading, deleteHero] = useAuthAxios<any>({
    requestOption: {
      url: `/v1/heroes/${writingHero.heroNo}`,
      method: 'delete',
    },
    onResponseSuccess: () => {
      showToast(`${writingHero.heroName}이 삭제되었습니다.`);
      // 주인공 관리 화면으로 이동
      navigation.push('NoTab', {
        screen: 'HeroSettingNavigator',
        params: {
          screen: 'HeroSetting',
        },
      });
    },
    onError: error => {
      showErrorToast(
        `${writingHero.heroName} 삭제를 실패했습니다.\n잠시 후 다시 시도 부탁드립니다.`,
      );
    },
    disableInitialRequest: true,
  });

  return [() => deleteHero({}), isLoading];
};
