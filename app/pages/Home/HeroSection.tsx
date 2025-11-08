import React, {useCallback} from 'react';
import {Keyboard} from 'react-native';
import {useRecoilValue} from 'recoil';
import {heroState} from '../../recoils/hero.recoil';
import {HeroType} from '../../types/hero.type';
import {PhotoHeroType} from '../../types/photo.type';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {ShareButton} from '../../components/button/ShareButton';
import HeroOverview from './HeroOverview';

type Props = {
  photoHero: PhotoHeroType | null;
  onSharePress: () => void;
};

const HeroSection = ({photoHero, onSharePress}: Props): JSX.Element => {
  // 글로벌 상태 관리 (Recoil)
  const hero = useRecoilValue<HeroType>(heroState);

  // Custom functions (핸들러, 로직 함수 등)
  const handleSharePress = useCallback(() => {
    Keyboard.dismiss();
    onSharePress();
  }, [onSharePress]);

  if (!photoHero) {
    return <></>;
  }

  return (
    <ContentContainer withScreenPadding useHorizontalLayout>
      <HeroOverview hero={photoHero} />
      {(hero.auth === 'OWNER' || hero.auth === 'ADMIN') && (
        <ContentContainer width={'auto'}>
          <ShareButton onPress={handleSharePress} />
        </ContentContainer>
      )}
    </ContentContainer>
  );
};

export default HeroSection;
