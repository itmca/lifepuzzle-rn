import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { ICarouselInstance } from 'react-native-reanimated-carousel/lib/typescript/types';
import { HeroWithPuzzleCntType } from '../../../../types/core/hero.type';
import { BasicCard } from '../../../../components/ui/display/Card';

type UseHeroCarouselReturn = {
  carouselRef: React.RefObject<ICarouselInstance | null>;
  carouselHeight: number;
  windowWidth: number;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  handleProgressChange: (offset: number, absoluteProgress: number) => void;
  handleSnapToItem: (index: number) => void;
  renderCarouselItem: ({
    item,
  }: {
    item: HeroWithPuzzleCntType;
  }) => React.ReactElement;
};

export const useHeroCarousel = (
  displayHeroes: HeroWithPuzzleCntType[],
): UseHeroCarouselReturn => {
  const carouselRef = useRef<ICarouselInstance>(null);
  const lastProgressChangeRef = useRef<number>(0);
  const { width: windowWidth } = useWindowDimensions();

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const carouselHeight = useMemo(() => windowWidth * 1.14, [windowWidth]);

  const handleProgressChange = useCallback(
    (_: number, absoluteProgress: number) => {
      const now = Date.now();
      if (now - lastProgressChangeRef.current >= 100) {
        lastProgressChangeRef.current = now;
        const newIndex = Math.floor(absoluteProgress);
        // 인덱스 유효성 검증
        if (newIndex >= 0 && newIndex < displayHeroes.length) {
          setCurrentIndex(newIndex);
        }
      }
    },
    [displayHeroes.length],
  );

  const handleSnapToItem = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const renderCarouselItem = useCallback(
    ({ item }: { item: HeroWithPuzzleCntType }) => {
      return (
        <BasicCard
          photoUrls={item.imageUrl ? [item.imageUrl] : []}
          height={carouselHeight}
          width={windowWidth}
          onPress={() => {}}
        />
      );
    },
    [carouselHeight, windowWidth],
  );

  return {
    carouselRef,
    carouselHeight,
    windowWidth,
    currentIndex,
    setCurrentIndex,
    handleProgressChange,
    handleSnapToItem,
    renderCarouselItem,
  };
};
