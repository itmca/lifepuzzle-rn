import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';
import {useUpdatePublisher} from './update.hooks';
import {heroUpdate} from '../../recoils/update.recoil';
import {useEffect} from 'react';
import {useRecoilValue, useResetRecoilState, useSetRecoilState} from 'recoil';
import {
  isHeroUploading,
  writingHeroKeyState,
  writingHeroState,
} from '../../recoils/hero-write.recoil';
import {useAuthAxios} from './network.hook';
import {Alert} from 'react-native';
import {CustomAlert} from '../../components/alert/CustomAlert';
import {isLoggedInState} from '../../recoils/auth.recoil';
import {useHeroHttpPayLoad} from './hero.payload.hook.ts';

export const useCreateHero = (): [() => void] => {
  const navigation = useNavigation<BasicNavigationProps>();
  const publishHeroUpdate = useUpdatePublisher(heroUpdate);

  const isLoggedIn = useRecoilValue<boolean>(isLoggedInState);
  const writingHeroKey = useRecoilValue<number>(writingHeroKeyState);

  const resetWritingHero = useResetRecoilState(writingHeroState);
  const setHeroUploading = useSetRecoilState(isHeroUploading);
  const writingHero = useRecoilValue(writingHeroState);
  const [isLoading, registerHero] = useAuthAxios({
    requestOption: {
      url: '/heroes',
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'},
    },
    onResponseSuccess: () => {
      CustomAlert.actionAlert({
        title: '주인공 생성',
        desc: '주인공이 생성되었습니다.',
        actionBtnText: '확인',
        action: goBack,
      });
    },
    onError: err => {
      console.log('err', err);
      CustomAlert.retryAlert('주인공 생성 실패하였습니다.', submit, goBack);
    },
    disableInitialRequest: true,
  });

  const goBack = () => {
    resetWritingHero();
    navigation.goBack();
    publishHeroUpdate();
  };

  const heroHttpPayLoad = useHeroHttpPayLoad();

  useEffect(() => {
    setHeroUploading(isLoading);
  }, [isLoading]);

  const submit = () => {
    console.log('writingHero', writingHero);
    console.log('heroHttpPayLoad', heroHttpPayLoad);
    registerHero({
      data: heroHttpPayLoad,
    });
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
      //   onSubmit();
      if (!validate()) {
        return;
      }

      submit();
    },
  ];
};
