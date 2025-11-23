import React, { useCallback } from 'react';
import { Keyboard } from 'react-native';

import { useHeroStore } from '../../../../stores/hero.store';
import { ContentContainer } from '../../../../components/ui/layout/ContentContainer.tsx';
import { ShareButton } from '../../../../components/feature/sharing/ShareButton';
import HeroOverview from './HeroOverview';

type Props = {
  onSharePress: () => void;
};

const HeroSection = ({ onSharePress }: Props): React.ReactElement => {
  // 글로벌 상태 관리 (Zustand)
  const hero = useHeroStore(state => state.currentHero);

  // Custom functions (핸들러, 로직 함수 등)
  const handleSharePress = useCallback(() => {
    Keyboard.dismiss();
    onSharePress();
  }, [onSharePress]);

  if (!hero) {
    return <></>;
  }

  return (
    <ContentContainer withScreenPadding useHorizontalLayout>
      <HeroOverview hero={hero} />
      {(hero.auth === 'OWNER' || hero.auth === 'ADMIN') && (
        <ContentContainer width={'auto'}>
          <ShareButton onPress={handleSharePress} />
        </ContentContainer>
      )}
    </ContentContainer>
  );
};

export default HeroSection;
