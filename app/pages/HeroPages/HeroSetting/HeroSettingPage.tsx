import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { TouchableOpacity, useWindowDimensions } from 'react-native';
import {
  HeroUserType,
  HeroWithPuzzleCntType,
} from '../../../types/core/hero.type';
import { PageContainer } from '../../../components/ui/layout/PageContainer';
import { useUpdateObserver } from '../../../services/common/cache-observer.hook.ts';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  BasicNavigationProps,
  HeroSettingRouteProps,
} from '../../../navigation/types';
import { HeroesQueryResponse } from '../../../types/hooks/hero-query.type';
import Carousel from 'react-native-reanimated-carousel';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../../components/ui/layout/ContentContainer.tsx';

import { Color } from '../../../constants/color.constant.ts';
import { useHeroStore } from '../../../stores/hero.store';
import { AccountAvatar } from '../../../components/ui/display/Avatar';
import { useRegisterSharedHero } from '../../../services/hero/hero.mutation';
import { ICarouselInstance } from 'react-native-reanimated-carousel/lib/typescript/types';
import { BasicCard } from '../../../components/ui/display/Card';
import {
  BodyTextB,
  BodyTextM,
  Caption,
  Head,
  Title,
} from '../../../components/ui/base/TextBase';
import { toInternationalAge } from '../../../utils/age-calculator.util.ts';
import dayjs from 'dayjs';
import { BasicButton } from '../../../components/ui/form/Button';
import { Divider } from '../../../components/ui/base/Divider';
import { HeroAuthTypeByCode } from '../../../constants/auth.constant.ts';
import { showToast } from '../../../components/ui/feedback/Toast';
import { SvgIcon } from '../../../components/ui/display/SvgIcon';
import { HeroAuthUpdateBottomSheet } from './HeroAuthUpdateBottomSheet.tsx';
import { useUserStore } from '../../../stores/user.store';
import { useAuthQuery } from '../../../services/core/auth-query.hook.ts';
import { useAuthMutation } from '../../../services/core/auth-mutation.hook.ts';
import { LoadingContainer } from '../../../components/ui/feedback/LoadingContainer.tsx';

const HeroSettingPage = (): React.ReactElement => {
  // Refs
  const carouselRef = useRef<ICarouselInstance>(null);
  const lastProgressChangeRef = useRef<number>(0);

  // React hooks
  const [authSettingModalOpen, setAuthSettingModalOpen] =
    useState<boolean>(false);
  const [authSettingUser, setAuthSettingUser] = useState<
    HeroUserType | undefined
  >(undefined);
  const [heroes, setHeroes] = useState<HeroWithPuzzleCntType[]>([]);
  const [displayHeroes, setDisplayHeroes] = useState<HeroWithPuzzleCntType[]>(
    [],
  );
  const [focusedHero, setFocusedHero] = useState<
    HeroWithPuzzleCntType | undefined
  >(heroes[0]);

  // 글로벌 상태 관리
  const user = useUserStore(state => state.user);
  const { setWritingHeroKey, currentHero, setCurrentHero } = useHeroStore();

  // 외부 hook 호출 (navigation, route 등)
  const navigation = useNavigation<BasicNavigationProps>();
  const route = useRoute<HeroSettingRouteProps<'HeroSetting'>>();
  const { width: windowWidth } = useWindowDimensions();

  // Custom hooks
  const heroUpdateObserver = useUpdateObserver('heroUpdate');

  const [, updateRecentHero] = useAuthMutation<void>({
    axiosConfig: {
      method: 'POST',
      url: '/v1/users/hero/recent',
    },
  });

  const {
    data: heroesData,
    isFetching: isLoading,
    refetch: fetchHeroes,
  } = useAuthQuery<HeroesQueryResponse>({
    queryKey: ['heroes'],
    axiosConfig: {
      url: '/v1/heroes',
    },
  });

  useEffect(() => {
    if (heroesData) {
      let resHeroes = heroesData.heroes.map((item: any) => ({
        ...item.hero,
        puzzleCount: item.puzzleCnt,
        users: item.users,
      }));
      setHeroes(resHeroes);
      setDisplayHeroes(resHeroes);
      setFocusedHero(resHeroes[0]);
    }
  }, [heroesData]);

  useRegisterSharedHero({
    shareKey: route.params?.shareKey,
    onRegisterSuccess: () => {
      void fetchHeroes();
      showToast('주인공을 추가하였습니다.');

      if (carouselRef && carouselRef.current) {
        setFocusedHero(heroes[heroes.length - 1]);
        carouselRef.current.scrollTo({ index: heroes.length - 1 });
      }
    },
  });

  // Side effects
  useEffect(() => {
    void fetchHeroes();
  }, [fetchHeroes, heroUpdateObserver]);

  useEffect(() => {
    if (!currentHero) return;

    const currentViewingHero = heroes.filter(
      hero => hero.id === currentHero.id,
    );
    const others = heroes.filter(hero => hero.id !== currentHero.id);
    setDisplayHeroes([...currentViewingHero, ...others]);
  }, [heroes, currentHero]);

  // Memoized values
  const carouselHeight = useMemo(() => windowWidth * 1.14, [windowWidth]);

  const currentUserAuth = useMemo(
    () =>
      focusedHero?.users.find(linkedUser => linkedUser.id === user?.id)?.auth,
    [focusedHero?.users, user?.id],
  );

  // Memoized callbacks
  const handleProgressChange = useCallback(
    (_: number, absoluteProgress: number) => {
      const now = Date.now();
      if (now - lastProgressChangeRef.current >= 100) {
        lastProgressChangeRef.current = now;
        setFocusedHero(displayHeroes[Math.floor(absoluteProgress)]);
      }
    },
    [displayHeroes],
  );

  const renderCarouselItem = useCallback(
    ({ item }: any) => {
      return (
        <BasicCard
          photoUrls={[item.imageUrl]}
          height={carouselHeight}
          width={windowWidth}
          onPress={() => {}}
        />
      );
    },
    [carouselHeight, windowWidth],
  );

  if (!focusedHero) {
    return (
      <LoadingContainer isLoading={true}>
        <></>
      </LoadingContainer>
    );
  }

  return (
    <PageContainer edges={['left', 'right', 'bottom']} isLoading={isLoading}>
      <ScrollContentContainer>
        <ContentContainer gap={0}>
          {/* 상단 사진 영역 */}
          <ContentContainer alignCenter height={carouselHeight}>
            <Carousel
              ref={carouselRef}
              data={displayHeroes}
              mode={'parallax'}
              modeConfig={{
                parallaxScrollingScale: 0.9,
                parallaxAdjacentItemScale: 0.75,
                parallaxScrollingOffset: 60,
              }}
              width={windowWidth}
              loop={false}
              onProgressChange={handleProgressChange}
              renderItem={renderCarouselItem}
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
                  gap={4}
                >
                  <Head>
                    {focusedHero.name.length > 8
                      ? focusedHero.name.substring(0, 8) + '...'
                      : focusedHero.name}
                  </Head>
                  <BodyTextB color={Color.GREY_400}>
                    {focusedHero.nickName.length > 8
                      ? focusedHero.nickName.substring(0, 12) + '...'
                      : focusedHero.nickName}
                  </BodyTextB>
                </ContentContainer>
                <ContentContainer
                  useHorizontalLayout
                  width={'auto'}
                  justifyContent={'flex-start'}
                  alignItems={'flex-start'}
                  gap={4}
                >
                  <Caption color={Color.GREY_600}>
                    {focusedHero.isLunar ? '음력' : '양력'}
                  </Caption>
                  <Caption color={Color.GREY_700}>
                    {dayjs(focusedHero.birthday).format('YYYY.MM.DD')}
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
                      setWritingHeroKey(focusedHero?.id);
                      navigation.navigate('App', {
                        screen: 'HeroSettingNavigator',
                        params: {
                          screen: 'HeroModification',
                          params: {
                            heroNo: focusedHero?.id,
                          },
                        },
                      });
                    }}
                  >
                    <BodyTextB color={Color.MAIN_DARK}>수정하기</BodyTextB>
                  </TouchableOpacity>
                )}
              </ContentContainer>
            </ContentContainer>
            <ContentContainer>
              <BasicButton
                onPress={() => {
                  setCurrentHero(focusedHero);
                  void updateRecentHero({
                    data: {
                      heroNo: focusedHero.id,
                    },
                  });

                  navigation.navigate('App', { screen: 'Home' });
                }}
                disabled={currentHero?.id === focusedHero.id}
                text={
                  currentHero?.id === focusedHero?.id
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

          {focusedHero?.users?.map((linkedUser, index) => {
            return (
              <ContentContainer
                key={index}
                alignItems={'center'}
                justifyContent={'flex-start'}
                height={52}
                useHorizontalLayout
                gap={12}
              >
                <ContentContainer useHorizontalLayout flex={1} expandToEnd>
                  <AccountAvatar
                    imageUrl={linkedUser.imageUrl}
                    size={52}
                    auth={linkedUser.auth}
                    iconSize={20}
                    iconPadding={0}
                  />
                  <ContentContainer gap={2}>
                    <BodyTextB color={Color.GREY_800}>
                      {linkedUser.nickName}
                    </BodyTextB>
                    <BodyTextM
                      color={
                        linkedUser.auth === 'OWNER'
                          ? Color.SUB_CORAL
                          : linkedUser.auth === 'ADMIN'
                            ? Color.SUB_TEAL
                            : Color.MAIN_DARK
                      }
                    >
                      {HeroAuthTypeByCode[linkedUser.auth].name}
                    </BodyTextM>
                  </ContentContainer>
                </ContentContainer>
                <ContentContainer width={'auto'}>
                  {(currentUserAuth === 'OWNER' ||
                    currentUserAuth === 'ADMIN') &&
                    linkedUser.auth !== 'OWNER' &&
                    linkedUser.id !== user?.id && (
                      <SvgIcon
                        name={'setting'}
                        size={24}
                        onPress={() => {
                          setAuthSettingModalOpen(true);
                          setAuthSettingUser(linkedUser);
                        }}
                      />
                    )}
                </ContentContainer>
              </ContentContainer>
            );
          })}
        </ContentContainer>
      </ScrollContentContainer>
      <HeroAuthUpdateBottomSheet
        opened={authSettingModalOpen}
        user={authSettingUser}
        hero={focusedHero}
        onSuccess={() => {
          setAuthSettingModalOpen(false);
        }}
        onClose={() => setAuthSettingModalOpen(false)}
      />
    </PageContainer>
  );
};

export { HeroSettingPage };
