import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';
import {useUpdatePublisher} from './update.hooks';
import {heroUpdate} from '../../recoils/update.recoil';
import {useEffect, useState} from 'react';
import {HeroType} from '../../types/hero.type';
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import {
  getCurrentHeroPhotoUri,
  writingHeroState,
  isHeroUploading,
  writingHeroKeyState,
} from '../../recoils/hero-write.recoil';
import {useAuthAxios} from './network.hook';
import {Alert} from 'react-native';
import {CustomAlert} from '../../components/alert/CustomAlert';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {IMG_TYPE} from '../../constants/upload-file-type.constant';
import {useHeroPayLoadForCreate, useHeroHttpPayLoad} from './hero.payload.hook';
import {isLoggedInState} from '../../recoils/auth.recoil';

export const useCreateHero = (): [() => void] => {
  const navigation = useNavigation<BasicNavigationProps>();
  const publishHeroUpdate = useUpdatePublisher(heroUpdate);

  const isLoggedIn = useRecoilValue<boolean>(isLoggedInState);
  const [writingHeroKey, setWritingHeroKey] =
    useRecoilState<number>(writingHeroKeyState);

  const resetWritingHero = useResetRecoilState(writingHeroState);
  const setHeroUploading = useSetRecoilState(isHeroUploading);
  const [writingHero, setWritingHero] = useRecoilState(writingHeroState);
  const currentHeroPhotoUri = useRecoilValue(getCurrentHeroPhotoUri);
  const [isLoading, registerHero] = useAuthAxios({
    requestOption: {
      url: '/heroes',
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'},
    },
    onResponseSuccess: () => {
      CustomAlert.actionAlert({
        title: '회원생성',
        desc: '주인공이 생성되었습니다.',
        actionBtnText: '확인',
        action: goBack,
      });
    },
    onError: err => {
      console.log(err, writingHeroKey);
      CustomAlert.retryAlert(
        '주인공 프로필 수정이 실패했습니다.',
        submit,
        goBack,
      );
    },
    disableInitialRequest: true,
  });

  const goBack = () => {
    resetWritingHero();
    navigation.goBack();
    publishHeroUpdate();
  };

  const heroHttpPayLoad = useHeroPayLoadForCreate();

  useEffect(() => {
    setHeroUploading(isLoading);
  }, [isLoading]);

  const submit = () => {
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
