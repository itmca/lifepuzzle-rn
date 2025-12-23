import React, { useEffect, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  BasicNavigationProps,
  HeroSettingRouteProps,
} from '../../../navigation/types';
import { HeroesQueryResponse } from '../../../types/hooks/hero-query.type';
import { PageContainer } from '../../../components/ui/layout/PageContainer';
import { useUpdateObserver } from '../../../services/common/cache-observer.hook.ts';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../../components/ui/layout/ContentContainer.tsx';
import { useHeroStore } from '../../../stores/hero.store';
import { useRegisterSharedHero } from '../../../services/hero/hero.mutation';
import { showToast } from '../../../components/ui/feedback/Toast';
import { Divider } from '../../../components/ui/base/Divider';
import { HeroAuthUpdateBottomSheet } from './HeroAuthUpdateBottomSheet.tsx';
import { useUserStore } from '../../../stores/user.store';
import { useAuthQuery } from '../../../services/core/auth-query.hook.ts';
import { useAuthMutation } from '../../../services/core/auth-mutation.hook.ts';
import { LoadingContainer } from '../../../components/ui/feedback/LoadingContainer.tsx';
import { transformHeroesQueryResponse } from '../../../utils/hero-transformer.util.ts';
import { HeroUserType } from '../../../types/core/hero.type.ts';
import { useHeroCarousel } from './hooks/useHeroCarousel';
import { useHeroSelection } from './hooks/useHeroSelection';
import { HeroCarouselSection } from './components/HeroCarouselSection';
import { HeroInfoSection } from './components/HeroInfoSection';
import { ConnectedAccountsSection } from './components/ConnectedAccountsSection';

const HeroSettingPage = (): React.ReactElement => {
  // React hooks
  const [authSettingModalOpen, setAuthSettingModalOpen] =
    useState<boolean>(false);
  const [authSettingUser, setAuthSettingUser] = useState<
    HeroUserType | undefined
  >(undefined);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // 글로벌 상태 관리
  const user = useUserStore(state => state.user);
  const { setWritingHeroKey, currentHero, setCurrentHero } = useHeroStore();

  // 외부 hook 호출 (navigation, route 등)
  const navigation = useNavigation<BasicNavigationProps>();
  const route = useRoute<HeroSettingRouteProps<'HeroSetting'>>();

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

  // Hero selection hook
  const heroSelection = useHeroSelection(currentHero, currentIndex);
  const { heroes, displayHeroes, focusedHero, setHeroes, setDisplayHeroes } =
    heroSelection;

  // Carousel hook
  const carousel = useHeroCarousel(
    displayHeroes,
    currentIndex,
    setCurrentIndex,
  );
  const {
    carouselRef,
    carouselHeight,
    windowWidth,
    handleProgressChange,
    handleSnapToItem,
    renderCarouselItem,
  } = carousel;

  useEffect(() => {
    if (heroesData) {
      const transformedHeroes = transformHeroesQueryResponse(heroesData.heroes);
      setHeroes(transformedHeroes);
      setDisplayHeroes(transformedHeroes);

      // 현재 보고 있던 Hero가 있다면 해당 위치 유지
      if (focusedHero) {
        const currentHeroIndex = transformedHeroes.findIndex(
          hero => hero.id === focusedHero.id,
        );
        if (currentHeroIndex !== -1) {
          setCurrentIndex(currentHeroIndex);
          return;
        }
      }

      // 초기 진입 또는 현재 Hero를 찾지 못한 경우 0으로 초기화
      setCurrentIndex(0);
    }
  }, [heroesData, setHeroes, setDisplayHeroes, setCurrentIndex, focusedHero]);

  useRegisterSharedHero({
    shareKey: route.params?.shareKey,
    onRegisterSuccess: async () => {
      const result = await fetchHeroes();
      showToast('주인공을 추가하였습니다.');

      if (result.data && carouselRef.current) {
        const lastIndex = result.data.heroes.length - 1;
        setCurrentIndex(lastIndex);
        carouselRef.current.scrollTo({ index: lastIndex });
      }
    },
  });

  // Side effects
  useEffect(() => {
    void fetchHeroes();
  }, [fetchHeroes, heroUpdateObserver]);

  // Memoized values
  const currentUserAuth = useMemo(
    () =>
      focusedHero?.users.find(linkedUser => linkedUser.id === user?.id)?.auth,
    [focusedHero?.users, user?.id],
  );

  // Handlers
  const handleEditPress = () => {
    if (!focusedHero) return;

    setWritingHeroKey(focusedHero.id);
    navigation.navigate('App', {
      screen: 'HeroSettingNavigator',
      params: {
        screen: 'HeroModification',
        params: {
          heroNo: focusedHero.id,
        },
      },
    });
  };

  const handleViewPress = () => {
    if (focusedHero) {
      setCurrentHero(focusedHero);
      void updateRecentHero({
        data: {
          heroNo: focusedHero.id,
        },
      });
      navigation.navigate('App', { screen: 'Home' });
    }
  };

  const handleSettingPress = (linkedUser: HeroUserType) => {
    setAuthSettingModalOpen(true);
    setAuthSettingUser(linkedUser);
  };

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
          <HeroCarouselSection
            carouselRef={carouselRef}
            displayHeroes={displayHeroes}
            carouselHeight={carouselHeight}
            windowWidth={windowWidth}
            onProgressChange={handleProgressChange}
            onSnapToItem={handleSnapToItem}
            renderItem={renderCarouselItem}
          />

          {/* 중간 주인공 정보 영역 */}
          <HeroInfoSection
            hero={focusedHero}
            currentHero={currentHero}
            onEditPress={handleEditPress}
            onViewPress={handleViewPress}
          />
        </ContentContainer>

        <Divider />

        {/* 하단 연결 계정 영역 */}
        <ConnectedAccountsSection
          users={focusedHero.users}
          currentUserId={user?.id}
          currentUserAuth={currentUserAuth}
          onSettingPress={handleSettingPress}
        />
      </ScrollContentContainer>

      <HeroAuthUpdateBottomSheet
        opened={authSettingModalOpen}
        user={authSettingUser}
        hero={focusedHero}
        onSuccess={() => {
          setAuthSettingModalOpen(false);
          void fetchHeroes();
        }}
        onClose={() => setAuthSettingModalOpen(false)}
      />
    </PageContainer>
  );
};

export { HeroSettingPage };
