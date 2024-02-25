import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import {useAuthAxios} from './network.hook';
import {Alert} from 'react-native';
import {useUpdatePublisher} from './update.hooks';
import {currentHeroUpdate, heroUpdate} from '../../recoils/update.recoil';
import {useNavigation} from '@react-navigation/native';
import {isLoggedInState} from '../../recoils/auth.recoil';
import {BasicNavigationProps} from '../../navigation/types';
import {useEffect} from 'react';
import {heroState} from '../../recoils/hero.recoil';
import {useHeroHttpPayLoad} from './hero.payload.hook';
import {
  isHeroUploading,
  writingHeroKeyState,
  writingHeroState,
} from '../../recoils/hero-write.recoil';
import {CustomAlert} from '../../components/alert/CustomAlert';

export const useResetAllWritingHero = () => {
  const resetWritingHero = useResetRecoilState(writingHeroState);

  return () => {
    resetWritingHero();
  };
};

export const useSaveHero = (): [() => void] => {
  const navigation = useNavigation<BasicNavigationProps>();
  const [writingHeroKey, setWritingHeroKey] =
    useRecoilState<number>(writingHeroKeyState);
  const writingHero = useRecoilValue(writingHeroState);
  const setHeroUploading = useSetRecoilState(isHeroUploading);
  const isLoggedIn = useRecoilValue<boolean>(isLoggedInState);

  const publishHeroUpdate = useUpdatePublisher(heroUpdate);
  const publishCurrentHeroUpdate = useUpdatePublisher(currentHeroUpdate);

  const resetAllWritingHero = useResetAllWritingHero();
  const heroHttpPayLoad = useHeroHttpPayLoad();

  const currentHero = useRecoilValue(heroState);
  const [isLoading, saveHero] = useAuthAxios<any>({
    requestOption: {
      method: writingHeroKey ? 'post' : 'post',
      url: writingHeroKey ? `/heroes/profile/${writingHeroKey}` : '/heroes',
      headers: {'Content-Type': 'multipart/form-data'},
    },
    onResponseSuccess: ({heroNo}) => {
      if (!writingHeroKey) {
        //console.log(`editHeroKey가 아닙니다 ${heroKey}`);
        setWritingHeroKey(heroNo);
      } else if (writingHeroKey) {
        CustomAlert.simpleAlert('주인공이 수정되었습니다.');
      }
      resetAllWritingHero();
      publishHeroUpdate();
      if (currentHero.heroNo === writingHeroKey) {
        publishCurrentHeroUpdate();
      }
      navigation.goBack();
    },
    onError: err => {
      writingHeroKey
        ? CustomAlert.retryAlert(
            '주인공 프로필 수정이 실패했습니다.',
            submit,
            navigation.goBack,
          )
        : Alert.alert(
            '주인공 프로필 등록이 실패했습니다. 재시도 부탁드립니다.',
          );
    },
    disableInitialRequest: true,
  });

  useEffect(() => {
    setHeroUploading(isLoading);
  }, [isLoading]);

  const submit = function () {
    saveHero({data: heroHttpPayLoad});
  };

  function validate(): boolean {
    if (!writingHero?.heroName) {
      Alert.alert('이름을 입력해주세요.');
      return false;
    } else if (!writingHero?.heroNickName) {
      Alert.alert('닉네임을 입력해주세요.');
      return false;
    } else if (!writingHero?.title) {
      Alert.alert('제목을 입력해주세요.');
      return false;
    } else if (!writingHero?.birthday) {
      Alert.alert('태어난 날 을 입력해주세요.');
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
  ];
};

export const useIsHeroUploading = (): boolean => {
  const heroUploadingStatus = useRecoilValue(isHeroUploading);

  return heroUploadingStatus;
};
