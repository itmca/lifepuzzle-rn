import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { PageContainer } from '../../../components/ui/layout/PageContainer';
import { ScrollContainer } from '../../../components/ui/layout/ScrollContainer';
import { ContentContainer } from '../../../components/ui/layout/ContentContainer.tsx';
import {
  Head,
  BodyTextM,
  BodyTextB,
} from '../../../components/ui/base/TextBase';
import { BasicCard } from '../../../components/ui/display/Card';
import { BasicButton } from '../../../components/ui/form/Button';
import { useHeroStore } from '../../../stores/hero.store';
import { useCreateHero } from '../../../services/hero/hero.mutation';
import { BasicNavigationProps } from '../../../navigation/types';
import { Color } from '../../../constants/color.constant';
import { getHeroImageUri } from '../../../utils/hero-image.util';
import { formatDateWithDay } from '../../../utils/date-formatter.util';

const HERO_CARD_ASPECT_RATIO = 335 / 385;

type InfoRowProps = {
  label: string;
  value: string;
};

const InfoRow = ({ label, value }: InfoRowProps): React.ReactElement => (
  <ContentContainer useHorizontalLayout justifyContent="space-between">
    <BodyTextB color={Color.GREY_600}>{label}</BodyTextB>
    <BodyTextM color={Color.GREY_900}>{value}</BodyTextM>
  </ContentContainer>
);

const HeroRegisterStep3Page = (): React.ReactElement => {
  // Navigation
  const navigation = useNavigation<BasicNavigationProps>();

  // Zustand store
  const { writingHero } = useHeroStore();

  // Create hero mutation
  const { createHero, isPending: isCreating } = useCreateHero();

  // Get hero profile image
  const heroProfileImage = getHeroImageUri(writingHero);

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <PageContainer edges={['left', 'right', 'bottom']} isLoading={isCreating}>
      <ScrollContainer>
        <ContentContainer withScreenPadding gap={24}>
          <ContentContainer gap={8}>
            <Head>입력하신 정보를 확인하세요</Head>
            <BodyTextM color={Color.GREY_600}>
              주인공의 정보가 맞는지 확인해주세요
            </BodyTextM>
          </ContentContainer>

          <ContentContainer aspectRatio={HERO_CARD_ASPECT_RATIO}>
            <BasicCard
              photoUrls={heroProfileImage ? [heroProfileImage] : []}
              editable={false}
              fallbackIconName={'profile'}
              fallbackText={'프로필 사진 없음'}
              fallbackBackgroundColor={Color.GREY_100}
            />
          </ContentContainer>

          <ContentContainer gap={16}>
            <InfoRow label="이름" value={writingHero.name ?? ''} />
            <InfoRow label="닉네임" value={writingHero.nickName ?? ''} />
            <InfoRow
              label="태어난 날"
              value={formatDateWithDay(writingHero.birthday)}
            />
          </ContentContainer>

          <ContentContainer gap={12}>
            <BasicButton
              text="주인공 추가하기"
              onPress={() => createHero()}
              disabled={isCreating}
            />
            <BasicButton
              text="이전으로"
              onPress={handleGoBack}
              backgroundColor={Color.WHITE}
              textColor={Color.MAIN_DARK}
              borderColor={Color.GREY_300}
              disabled={isCreating}
            />
          </ContentContainer>
        </ContentContainer>
      </ScrollContainer>
    </PageContainer>
  );
};

export { HeroRegisterStep3Page };
