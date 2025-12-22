import React, { memo } from 'react';
import Carousel from 'react-native-reanimated-carousel';
import { ICarouselInstance } from 'react-native-reanimated-carousel/lib/typescript/types';
import { ContentContainer } from '../../../../components/ui/layout/ContentContainer.tsx';
import { HeroWithPuzzleCntType } from '../../../../types/core/hero.type';

type HeroCarouselSectionProps = {
  carouselRef: React.RefObject<ICarouselInstance | null>;
  displayHeroes: HeroWithPuzzleCntType[];
  carouselHeight: number;
  windowWidth: number;
  onProgressChange: (offset: number, absoluteProgress: number) => void;
  onSnapToItem: (index: number) => void;
  renderItem: ({ item }: { item: HeroWithPuzzleCntType }) => React.ReactElement;
};

const HeroCarouselSectionComponent = ({
  carouselRef,
  displayHeroes,
  carouselHeight,
  windowWidth,
  onProgressChange,
  onSnapToItem,
  renderItem,
}: HeroCarouselSectionProps): React.ReactElement => {
  return (
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
        onProgressChange={onProgressChange}
        onSnapToItem={onSnapToItem}
        renderItem={renderItem}
      />
    </ContentContainer>
  );
};

export const HeroCarouselSection = memo(HeroCarouselSectionComponent);
