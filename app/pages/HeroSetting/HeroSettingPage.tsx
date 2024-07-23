import React, {useEffect, useState} from 'react';

import {Dimensions} from 'react-native';
import HeroCard from './HeroCard';
import {useAuthAxios} from '../../service/hooks/network.hook';
import {HeroWithPuzzleCntType} from '../../types/hero.type';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {useUpdateObserver} from '../../service/hooks/update.hooks';
import {heroUpdate} from '../../recoils/update.recoil';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  BasicNavigationProps,
  HeroSettingRouteProps,
} from '../../navigation/types';
import {HeroesQueryResponse} from '../../service/hooks/hero.query.hook';
import {CustomAlert} from '../../components/alert/CustomAlert';
import {method} from 'lodash';
import ImageModal from '../../components/alert/ImageModal';
import Carousel from 'react-native-reanimated-carousel';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer.tsx';
import {ContentContainer} from '../../components/styled/container/ContentContainer.tsx';

const HeroSettingPage = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  const route = useRoute<HeroSettingRouteProps<'HeroSetting'>>();
  const share = route.params ?? {};
  console.log('share', share);

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const [heroes, setHeroes] = useState<HeroWithPuzzleCntType[]>([]);
  const heroUpdateObserver = useUpdateObserver(heroUpdate);

  const [isLoading, fetchHeroes] = useAuthAxios<HeroesQueryResponse>({
    requestOption: {
      url: '/heroes/v2',
    },
    onResponseSuccess: res => {
      setHeroes(
        res.heroes.map(item => ({
          ...item.hero,
          puzzleCount: item.puzzleCnt,
          users: item.users,
        })),
      );
    },
    disableInitialRequest: false,
  });

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    message: string;
    imageSource: any;
    leftBtnText: string;
    rightBtnText: string;
    onLeftBtnPress: () => void;
    onRightBtnPress: () => void;
  }>({
    isOpen: false,
    message: '',
    imageSource: require('../../assets/images/celebration-character.png'),
    leftBtnText: '',
    rightBtnText: '',
    onLeftBtnPress: () => {},
    onRightBtnPress: () => {},
  });

  const shareKey = route.params?.shareKey;

  const [isRegisterLoading, registerHero] = useAuthAxios<any>({
    requestOption: {
      url: `/heroes/auth?shareKey=${encodeURIComponent(shareKey)}`,
      method: 'post',
    },
    onResponseSuccess: () => {
      setModalState({
        isOpen: true,
        message: '주인공을 추가하였습니다',
        imageSource: require('../../assets/images/celebration-character.png'),
        leftBtnText: '확인',
        rightBtnText: '',
        onLeftBtnPress: () => {
          // 주인공 관리 화면으로 가도록 rightBtnPress 함수 로직 변경하기
          // 새로 추가된 주인공이 뒤에 오도록 api 수정
          // 맨 뒤에 carosel 로 화면에 보여질 수 있도록 하기
          setModalState(prev => ({...prev, isOpen: false}));
        },
        onRightBtnPress: () => {},
      });
    },
    onError: error => {
      if (error.response?.status === 409) {
        CustomAlert.simpleAlert('이미 등록되어 있는 주인공입니다');
      } else if (error.response?.status === 410) {
        // TODO : 기간 만료 코드 확인 필요
        CustomAlert.simpleAlert('기간 만료된 링크입니다');
      } else {
        // action alert
        CustomAlert.actionAlert({
          title: '오류가 발생했습니다.',
          desc: '잠시 후 다시 시도하거나 새로 접속해주세요',
          actionBtnText: '재시도',
          action: () => {
            registerHero({
              requestOption: {
                url: `/heroes/auth?shareKey=${encodeURIComponent(shareKey)}`,
                method: 'post',
              },
            });
          },
        });
      }
    },
    disableInitialRequest: true,
  });
  useEffect(() => {
    fetchHeroes({});
  }, [heroUpdateObserver]);

  useEffect(() => {
    const shareKey = route.params?.shareKey;
    if (shareKey) {
      registerHero({
        requestOption: {
          url: `/heroes/auth?shareKey=${encodeURIComponent(shareKey)}`,
          method: 'post',
        },
      });
    }
  }, [route.params]);

  return (
    <LoadingContainer isLoading={isLoading}>
      <ScreenContainer>
        <ContentContainer alignCenter>
          <Carousel
            data={[...heroes, {isButton: true}]}
            width={windowWidth}
            renderItem={({item}: any) => {
              return <HeroCard hero={item} isButton={item.isButton} />;
            }}
          />
        </ContentContainer>
        <ImageModal
          message={modalState.message}
          leftBtnText={modalState.leftBtnText}
          rightBtnText={modalState.rightBtnText}
          onLeftBtnPress={modalState.onLeftBtnPress}
          onRightBtnPress={modalState.onRightBtnPress}
          imageSource={modalState.imageSource}
          isModalOpen={modalState.isOpen}
        />
      </ScreenContainer>
    </LoadingContainer>
  );
};

export default HeroSettingPage;
