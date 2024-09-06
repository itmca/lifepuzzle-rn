import React, {useEffect, useRef, useState} from 'react';

import {TouchableOpacity, useWindowDimensions} from 'react-native';
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
import ImageModal from '../../components/alert/ImageModal';
import Carousel from 'react-native-reanimated-carousel';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer.tsx';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../components/styled/container/ContentContainer.tsx';
import {
  MediumText,
  SmallText,
  XSmallText,
  XXLargeText,
} from '../../components/styled/components/Text.tsx';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {userState} from '../../recoils/user.recoil.ts';
import {Color} from '../../constants/color.constant.ts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {writingHeroKeyState} from '../../recoils/hero-write.recoil.ts';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {AccountAvatar} from '../../components/avatar/AccountAvatar.tsx';

const HeroSettingPage = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  const statusBarHeight = getStatusBarHeight();
  const route = useRoute<HeroSettingRouteProps<'HeroSetting'>>();
  const carouselRef = useRef(null);

  const {width: windowWidth, height: windowHeight} = useWindowDimensions();

  const [heroes, setHeroes] = useState<HeroWithPuzzleCntType[]>([]);
  const heroUpdateObserver = useUpdateObserver(heroUpdate);
  const currentUser = useRecoilValue(userState);
  const [focusedHero, setFocusedHero] = useState<HeroWithPuzzleCntType>(
    heroes[0],
  );
  const setWritingHeroNo = useSetRecoilState(writingHeroKeyState);

  const [isLoading, fetchHeroes] = useAuthAxios<HeroesQueryResponse>({
    requestOption: {
      url: '/heroes/v2',
    },
    onResponseSuccess: res => {
      let resHeroes = res.heroes.map(item => ({
        ...item.hero,
        puzzleCount: item.puzzleCnt,
        users: item.users,
      }));
      setHeroes(resHeroes);
      setFocusedHero(resHeroes[0]);
    },
    onError: error => {
      console.log('error', error);
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
          setModalState(prev => ({...prev, isOpen: false}));
          navigation.push('NoTab', {
            screen: 'HeroSettingNavigator',
            params: {
              screen: 'HeroSetting',
              params: {
                scrollToEnd: true,
              },
            },
          });
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

  useEffect(() => {
    if (route.params?.scrollToEnd && carouselRef.current && heroes.length > 0) {
      setFocusedHero(heroes[heroes.length - 1]);
      carouselRef.current.scrollTo({index: heroes.length - 1});
    }
  }, [heroes, route.params?.scrollToEnd]);
  return (
    <LoadingContainer isLoading={isLoading}>
      <ScreenContainer>
        <ContentContainer alignCenter gap={0} flex={1}>
          <ContentContainer
            withContentPadding
            paddingVertical={0}
            gap={4}
            useHorizontalLayout
            alignItems={'flex-end'}
            height={'40px'}>
            <XXLargeText bold>{focusedHero?.heroName}</XXLargeText>
            <MediumText color={Color.FONT_GRAY}>
              {focusedHero?.heroNickName}
            </MediumText>
            <ContentContainer
              alignItems={'flex-end'}
              expandToEnd
              width={'auto'}>
              <TouchableOpacity
                onPress={() => {
                  setWritingHeroNo(focusedHero?.heroNo);
                  navigation.push('NoTab', {
                    screen: 'HeroSettingNavigator',
                    params: {
                      screen: 'HeroModification',
                      params: {
                        heroNo: focusedHero?.heroNo,
                      },
                    },
                  });
                }}>
                <Icon name={'cog'} size={24} color="#D0D0D0" />
              </TouchableOpacity>
            </ContentContainer>
          </ContentContainer>
          <ContentContainer alignCenter flex={1} expandToEnd>
            <Carousel
              ref={carouselRef}
              data={[...heroes]}
              mode={'parallax'}
              modeConfig={{
                parallaxScrollingScale: 0.9,
                parallaxAdjacentItemScale: 0.8,
                parallaxScrollingOffset: 60,
              }}
              width={windowWidth}
              loop={false}
              onSnapToItem={index => {
                setFocusedHero(heroes[index]);
              }}
              renderItem={({item}: any) => {
                return <HeroCard hero={item} />;
              }}
            />
          </ContentContainer>
          <ContentContainer withScreenPadding paddingTop={0} paddingBottom={4}>
            <SmallText>{focusedHero ? '연결 계정' : ''}</SmallText>
            <ScrollContentContainer
              useHorizontalLayout
              gap={4}
              alignItems={'flex-start'}
              justifyContent={'flex-start'}>
              {focusedHero?.users?.map((user, index) => {
                return (
                  <ContentContainer
                    key={index}
                    alignItems={'center'}
                    justifyContent={'flex-start'}
                    width={'56px'}
                    height={'88px'}
                    paddingBottom={8}
                    gap={4}>
                    <AccountAvatar
                      nickName={user.nickName || ''}
                      imageURL={user.imageURL}
                      size={40}
                    />
                    {
                      <XSmallText
                        numberOfLines={2}
                        color={
                          user.userNo === currentUser.userNo
                            ? Color.PRIMARY_LIGHT
                            : Color.FONT_GRAY
                        }
                        bold>
                        {user.nickName}
                      </XSmallText>
                    }
                  </ContentContainer>
                );
              })}
            </ScrollContentContainer>
          </ContentContainer>
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
