import {useAuthAxios} from '../core/auth-http.hook';
import {Alert} from 'react-native';
import {useUpdatePublisher} from '../common/update.hook';
import {useNavigation} from '@react-navigation/native';
import {useAuthStore} from '../../stores/auth.store';
import {BasicNavigationProps} from '../../navigation/types';
import {useHeroStore} from '../../stores/hero.store';
import {HeroPayloadService} from './hero-payload.service';
import {CustomAlert} from '../../components/ui/feedback/CustomAlert';

export const useResetAllWritingHero = () => {
  const resetWritingHero = useHeroStore(state => state.resetWritingHero);

  return () => {
    resetWritingHero();
  };
};

export const useUpdateHero = (): [() => void, boolean] => {
  const navigation = useNavigation<BasicNavigationProps>();
  const writingHeroKey = useHeroStore(state => state.writingHeroKey);
  const setWritingHeroKey = useHeroStore(state => state.setWritingHeroKey);
  const writingHero = useHeroStore(state => state.writingHero);
  const isLoggedIn = useAuthStore(state => state.isLoggedIn());

  const publishHeroUpdate = useUpdatePublisher('heroUpdate');
  const publishCurrentHeroUpdate = useUpdatePublisher('currentHeroUpdate');

  const resetAllWritingHero = useResetAllWritingHero();
  const heroHttpPayLoad = writingHeroKey
    ? HeroPayloadService.createHeroFormData(writingHeroKey, writingHero)
    : null;

  const currentHero = useHeroStore(state => state.currentHero);

  const [isLoading, saveHero] = useAuthAxios<any>({
    requestOption: {
      method: 'put',
      url: `/v1/heroes/${writingHeroKey}`,
      headers: {'Content-Type': 'multipart/form-data'},
    },
    onResponseSuccess: () => {
      CustomAlert.simpleAlert('주인공이 수정되었습니다.');
      setWritingHeroKey(undefined);
      resetAllWritingHero();
      publishHeroUpdate();
      if (currentHero?.heroNo === writingHeroKey) {
        publishCurrentHeroUpdate();
      }
      navigation.goBack();
    },
    onError: () => {
      CustomAlert.retryAlert(
        '주인공 수정 실패했습니다.',
        submit,
        navigation.goBack,
      );
    },
    disableInitialRequest: true,
  });

  const submit = function () {
    if (writingHeroKey === undefined || !heroHttpPayLoad) {
      return;
    }

    saveHero({data: heroHttpPayLoad});
  };

  function validate(): boolean {
    if (!writingHero?.heroName) {
      CustomAlert.simpleAlert('이름을 입력해주세요.');
      return false;
    } else if (!writingHero?.heroNickName) {
      CustomAlert.simpleAlert('닉네임을 입력해주세요.');
      return false;
    } else if (!writingHero?.birthday) {
      CustomAlert.simpleAlert('태어난 날 을 입력해주세요.');
      return false;
    } else if (!isLoggedIn) {
      Alert.alert(
        '미로그인 시점에 작성한 이야기는 저장할 수 없습니다.',
        '',
        [
          {
            text: '로그인하러가기',
            style: 'default',
            onPress: () => {
              navigation.push('NoTab', {
                screen: 'LoginRegisterNavigator',
                params: {
                  screen: 'LoginMain',
                },
              });
            },
          },
          {text: '계속 둘러보기', style: 'default'},
        ],
        {
          cancelable: true,
        },
      );
      return false;
    }

    return true;
  }

  return [
    () => {
      if (!validate()) {
        return;
      }

      submit();
    },
    isLoading,
  ];
};
