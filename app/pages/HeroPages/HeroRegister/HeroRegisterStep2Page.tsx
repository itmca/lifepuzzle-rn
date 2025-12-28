import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PageContainer } from '../../../components/ui/layout/PageContainer';
import { ScrollContainer } from '../../../components/ui/layout/ScrollContainer';
import { ContentContainer } from '../../../components/ui/layout/ContentContainer.tsx';
import { BodyTextM, Head } from '../../../components/ui/base/TextBase';
import { BasicCard } from '../../../components/ui/display/Card';
import { BasicButton } from '../../../components/ui/form/Button';
import { useHeroStore } from '../../../stores/hero.store';
import {
  BasicNavigationProps,
  HeroSettingRouteProps,
} from '../../../navigation/types';
import { Color } from '../../../constants/color.constant';
import { getHeroImageUri } from '../../../utils/hero-image.util';

const HERO_CARD_ASPECT_RATIO = 335 / 385;

const HeroRegisterStep2Page = (): React.ReactElement => {
  // Navigation
  const navigation = useNavigation<BasicNavigationProps>();
  const route = useRoute<HeroSettingRouteProps<'HeroRegisterStep2'>>();

  // Zustand store
  const { writingHero } = useHeroStore();

  // Get hero profile image
  const heroProfileImage = getHeroImageUri(writingHero);

  const navigateToProfileSelector = () => {
    navigation.navigate('App', {
      screen: 'HeroSettingNavigator',
      params: {
        screen: 'HeroProfileSelector',
      },
    });
  };

  const handleNext = () => {
    navigation.navigate('App', {
      screen: 'HeroSettingNavigator',
      params: {
        screen: 'HeroRegisterStep3',
        params: {
          source: route.params?.source,
        },
      },
    });
  };

  const handleSkip = () => {
    navigation.navigate('App', {
      screen: 'HeroSettingNavigator',
      params: {
        screen: 'HeroRegisterStep3',
        params: {
          source: route.params?.source,
        },
      },
    });
  };

  return (
    <PageContainer edges={['left', 'right', 'bottom']}>
      <ScrollContainer>
        <ContentContainer withScreenPadding gap={24}>
          <ContentContainer gap={8}>
            <Head>이 사람을 떠올리게 하는 사진이 있나요?</Head>
            <BodyTextM color={Color.GREY_600}>
              대표 사진이에요. 얼굴이 보이면 좋아요.
            </BodyTextM>
          </ContentContainer>

          <ContentContainer aspectRatio={HERO_CARD_ASPECT_RATIO}>
            <BasicCard
              photoUrls={heroProfileImage ? [heroProfileImage] : []}
              editable={true}
              fallbackIconName={'cameraAdd'}
              fallbackText={'대표 사진 추가'}
              fallbackBackgroundColor={Color.GREY_100}
              onPress={navigateToProfileSelector}
            />
          </ContentContainer>

          <ContentContainer gap={12}>
            <BasicButton text="다음" onPress={handleNext} />
            <BasicButton
              text="건너뛰기"
              onPress={handleSkip}
              backgroundColor={Color.WHITE}
              textColor={Color.MAIN_DARK}
              borderColor={Color.GREY_300}
            />
          </ContentContainer>
        </ContentContainer>
      </ScrollContainer>
    </PageContainer>
  );
};

export { HeroRegisterStep2Page };
