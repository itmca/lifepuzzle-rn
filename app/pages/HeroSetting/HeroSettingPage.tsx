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
} from '../../components/styled/components/LegacyText.tsx';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {userState} from '../../recoils/user.recoil.ts';
import {LegacyColor} from '../../constants/color.constant.ts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {writingHeroKeyState} from '../../recoils/hero-write.recoil.ts';
import {AccountAvatar} from '../../components/avatar/AccountAvatar.tsx';
import {useRegisterSharedHero} from '../../service/hooks/share.hero.hook.ts';
import {ICarouselInstance} from 'react-native-reanimated-carousel/lib/typescript/types';

const HeroSettingPage = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  const route = useRoute<HeroSettingRouteProps<'HeroSetting'>>();
  const carouselRef = useRef<ICarouselInstance>(null);

  const {width: windowWidth} = useWindowDimensions();

  const [heroes, setHeroes] = useState<HeroWithPuzzleCntType[]>([]);
  const heroUpdateObserver = useUpdateObserver(heroUpdate);
  const currentUser = useRecoilValue(userState);
  const [focusedHero, setFocusedHero] = useState<HeroWithPuzzleCntType>(
    heroes[0],
  );

  const setWritingHeroNo = useSetRecoilState(writingHeroKeyState);

  const [isLoading, fetchHeroes] = useAuthAxios<HeroesQueryResponse>({
    requestOption: {
      url: '/v1/heroes',
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
      // TODO: 에러 처리
    },
    disableInitialRequest: false,
  });

  useEffect(() => {
    fetchHeroes({});
  }, [heroUpdateObserver]);

  useRegisterSharedHero({
    shareKey: route.params?.shareKey,
    onRegisterSuccess: () => {
      fetchHeroes({});
      setModalState({
        isOpen: true,
        message: '주인공을 추가하였습니다',
        imageSource: require('../../assets/images/celebration-character.png'),
        leftBtnText: '확인',
        rightBtnText: '',
        onLeftBtnPress: () => {
          setModalState(prev => ({...prev, isOpen: false}));
        },
        onRightBtnPress: () => {},
      });

      if (carouselRef && carouselRef.current) {
        setFocusedHero(heroes[heroes.length - 1]);
        carouselRef.current.scrollTo({index: heroes.length - 1});
      }
    },
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

  if (focusedHero === undefined) {
    return <></>;
  }

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
            <XXLargeText bold>
              {focusedHero.heroName.length > 8
                ? focusedHero.heroName.substring(0, 8) + '...'
                : focusedHero.heroName}
            </XXLargeText>
            <MediumText color={LegacyColor.FONT_GRAY}>
              {focusedHero.heroNickName.length > 8
                ? focusedHero.heroNickName.substring(0, 12) + '...'
                : focusedHero.heroNickName}
            </MediumText>
            <ContentContainer
              alignItems={'flex-end'}
              expandToEnd
              width={'auto'}>
              {focusedHero.auth !== 'VIEWER' && (
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
              )}
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
              onProgressChange={(_: number, absoluteProgress: number) => {
                setFocusedHero(heroes[Math.floor(absoluteProgress)]);
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
                            ? LegacyColor.PRIMARY_LIGHT
                            : LegacyColor.FONT_GRAY
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
