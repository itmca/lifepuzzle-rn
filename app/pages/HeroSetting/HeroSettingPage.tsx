import React, {useEffect, useRef, useState} from 'react';

import {TouchableOpacity, useWindowDimensions} from 'react-native';
import {useAuthAxios} from '../../service/hooks/network.hook';
import {HeroType, HeroWithPuzzleCntType} from '../../types/hero.type';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {useUpdateObserver} from '../../service/hooks/update.hooks';
import {heroUpdate} from '../../recoils/update.recoil';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  BasicNavigationProps,
  HeroSettingRouteProps,
} from '../../navigation/types';
import {HeroesQueryResponse} from '../../service/hooks/hero.query.hook';
import Carousel from 'react-native-reanimated-carousel';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../components/styled/container/ContentContainer.tsx';
import {useRecoilState, useSetRecoilState} from 'recoil';
import {Color} from '../../constants/color.constant.ts';
import {writingHeroKeyState} from '../../recoils/hero-write.recoil.ts';
import {AccountAvatar} from '../../components/avatar/AccountAvatar.tsx';
import {useRegisterSharedHero} from '../../service/hooks/share.hero.hook.ts';
import {ICarouselInstance} from 'react-native-reanimated-carousel/lib/typescript/types';
import {BasicCard} from '../../components/card/Card.tsx';
import {
  BodyTextB,
  BodyTextM,
  Caption,
  Head,
  Title,
} from '../../components/styled/components/Text.tsx';
import {toInternationalAge} from '../../service/date-time-display.service.ts';
import {format} from 'date-fns';
import {BasicButton} from '../../components/button/BasicButton.tsx';
import {Divider} from '../../components/styled/components/Divider.tsx';
import {heroState} from '../../recoils/hero.recoil.ts';
import {HeroAuthTypeByCode} from '../../constants/auth.constant.ts';
import {showToast} from '../../components/styled/components/Toast.tsx';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer.tsx';

const HeroSettingPage = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  const route = useRoute<HeroSettingRouteProps<'HeroSetting'>>();
  const carouselRef = useRef<ICarouselInstance>(null);

  const {width: windowWidth} = useWindowDimensions();

  const [heroes, setHeroes] = useState<HeroWithPuzzleCntType[]>([]);
  const [displayHeroes, setDisplayHeroes] = useState<HeroWithPuzzleCntType[]>(
    [],
  );
  const heroUpdateObserver = useUpdateObserver(heroUpdate);
  const [focusedHero, setFocusedHero] = useState<HeroWithPuzzleCntType>(
    heroes[0],
  );

  const setWritingHeroNo = useSetRecoilState(writingHeroKeyState);

  const [currentHero, setCurrentHero] = useRecoilState<HeroType>(heroState);

  const [_, updateRecentHero] = useAuthAxios<void>({
    requestOption: {
      method: 'POST',
      url: '/v1/users/hero/recent',
    },
    onResponseSuccess: () => {},
    disableInitialRequest: true,
  });

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
      setDisplayHeroes(resHeroes);
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

  useEffect(() => {
    const currentViewingHero = heroes.filter(
      hero => hero.heroNo === currentHero.heroNo,
    );
    const others = heroes.filter(hero => hero.heroNo !== currentHero.heroNo);
    setDisplayHeroes([...currentViewingHero, ...others]);
  }, [heroes, currentHero]);

  useRegisterSharedHero({
    shareKey: route.params?.shareKey,
    onRegisterSuccess: () => {
      fetchHeroes({});
      showToast('주인공을 추가하였습니다.');

      if (carouselRef && carouselRef.current) {
        setFocusedHero(heroes[heroes.length - 1]);
        carouselRef.current.scrollTo({index: heroes.length - 1});
      }
    },
  });

  if (focusedHero === undefined) {
    return <></>;
  }

  return (
    <LoadingContainer isLoading={isLoading}>
      <ScreenContainer>
        <ScrollContentContainer>
          <ContentContainer gap={0}>
            {/* 상단 사진 영역 */}
            <ContentContainer alignCenter height={windowWidth * 1.14}>
              <Carousel
                ref={carouselRef}
                data={[...heroes]}
                mode={'parallax'}
                modeConfig={{
                  parallaxScrollingScale: 0.9,
                  parallaxAdjacentItemScale: 0.75,
                  parallaxScrollingOffset: 60,
                }}
                width={windowWidth}
                loop={false}
                onProgressChange={(_: number, absoluteProgress: number) => {
                  setFocusedHero(displayHeroes[Math.floor(absoluteProgress)]);
                }}
                renderItem={({item}: any) => {
                  return (
                    <BasicCard
                      photoUrls={[item.imageURL]}
                      height={windowWidth * 1.14}
                      width={windowWidth}
                      onPress={() => {}}
                    />
                  );
                }}
              />
            </ContentContainer>
            {/* 중간 주인공 정보 영역 */}
            <ContentContainer withScreenPadding paddingVertical={0}>
              <ContentContainer useHorizontalLayout paddingVertical={6}>
                <ContentContainer gap={4} flex={1} expandToEnd>
                  <ContentContainer
                    useHorizontalLayout
                    width={'auto'}
                    justifyContent={'flex-start'}
                    gap={4}>
                    <Head>
                      {focusedHero.heroName.length > 8
                        ? focusedHero.heroName.substring(0, 8) + '...'
                        : focusedHero.heroName}
                    </Head>
                    <BodyTextB color={Color.GREY_400}>
                      {focusedHero.heroNickName.length > 8
                        ? focusedHero.heroNickName.substring(0, 12) + '...'
                        : focusedHero.heroNickName}
                    </BodyTextB>
                  </ContentContainer>
                  <ContentContainer
                    useHorizontalLayout
                    width={'auto'}
                    justifyContent={'flex-start'}
                    alignItems={'flex-start'}
                    gap={4}>
                    <Caption color={Color.GREY_600}>
                      {focusedHero.isLunar ? '음력' : '양력'}
                    </Caption>
                    <Caption color={Color.GREY_700}>
                      {format(new Date(focusedHero.birthday), 'yyyy.MM.dd')}
                    </Caption>
                    <Caption color={Color.GREY_600}>
                      (만 {toInternationalAge(focusedHero.birthday)}세)
                    </Caption>
                  </ContentContainer>
                </ContentContainer>
                <ContentContainer width={'auto'}>
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
                      <BodyTextB color={Color.MAIN_DARK}>수정하기</BodyTextB>
                    </TouchableOpacity>
                  )}
                </ContentContainer>
              </ContentContainer>
              <ContentContainer>
                <BasicButton
                  onPress={() => {
                    setCurrentHero(focusedHero);
                    updateRecentHero({
                      data: {
                        heroNo: focusedHero.heroNo,
                      },
                    });

                    navigation.navigate('HomeTab', {screen: 'Home'});
                  }}
                  disabled={currentHero?.heroNo === focusedHero.heroNo}
                  text={
                    currentHero?.heroNo === focusedHero?.heroNo
                      ? '지금 보고 있어요'
                      : '보기'
                  }
                />
              </ContentContainer>
            </ContentContainer>
          </ContentContainer>
          <Divider />
          {/* 하단 연결 계정 영역 */}
          <ContentContainer withScreenPadding paddingTop={0} paddingBottom={4}>
            <Title>{focusedHero ? '연결된 계정' : ''}</Title>

            {focusedHero?.users?.map((user, index) => {
              return (
                <ContentContainer
                  key={index}
                  alignItems={'center'}
                  justifyContent={'flex-start'}
                  height={52}
                  useHorizontalLayout
                  gap={12}>
                  <ContentContainer useHorizontalLayout flex={1} expandToEnd>
                    <AccountAvatar
                      imageURL={user.imageURL}
                      size={52}
                      auth={user.auth}
                      iconSize={20}
                      iconPadding={0}
                    />
                    <ContentContainer gap={2}>
                      <BodyTextB color={Color.GREY_800}>
                        {user.nickName}
                      </BodyTextB>
                      <BodyTextM
                        color={
                          user.auth === 'OWNER'
                            ? Color.SUB_CORAL
                            : user.auth === 'ADMIN'
                            ? Color.SUB_TEAL
                            : Color.MAIN_DARK
                        }>
                        {HeroAuthTypeByCode[user.auth].name}
                      </BodyTextM>
                    </ContentContainer>
                  </ContentContainer>
                  <ContentContainer width={'auto'}>
                    {/* TODO(border-line): 디자인 개편 1차 앱 배포 이후 권한 수정 기능 구현 필요 */}
                    {/*{user.auth !== 'OWNER' && (*/}
                    {/*  <SvgIcon name={'setting'} size={24} />*/}
                    {/*)}*/}
                  </ContentContainer>
                </ContentContainer>
              );
            })}
          </ContentContainer>
        </ScrollContentContainer>
      </ScreenContainer>
    </LoadingContainer>
  );
};

export default HeroSettingPage;
