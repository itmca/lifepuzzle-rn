import { useEffect, useMemo, useState } from 'react';
import {
  HeroType,
  HeroWithPuzzleCntType,
} from '../../../../types/core/hero.type';

type UseHeroSelectionReturn = {
  heroes: HeroWithPuzzleCntType[];
  displayHeroes: HeroWithPuzzleCntType[];
  focusedHero: HeroWithPuzzleCntType | undefined;
  setHeroes: (heroes: HeroWithPuzzleCntType[]) => void;
  setDisplayHeroes: (heroes: HeroWithPuzzleCntType[]) => void;
};

/**
 * Hero 선택 및 정렬 로직을 관리하는 hook
 * currentHero를 첫 번째로 정렬하고, focusedHero를 계산
 */
export const useHeroSelection = (
  currentHero: HeroType | null,
  currentIndex: number,
): UseHeroSelectionReturn => {
  const [heroes, setHeroes] = useState<HeroWithPuzzleCntType[]>([]);
  const [displayHeroes, setDisplayHeroes] = useState<HeroWithPuzzleCntType[]>(
    [],
  );

  // currentHero를 기준으로 displayHeroes 재정렬
  useEffect(() => {
    if (!currentHero) return;

    const currentViewingHero = heroes.filter(
      hero => hero.id === currentHero.id,
    );
    const others = heroes.filter(hero => hero.id !== currentHero.id);
    setDisplayHeroes([...currentViewingHero, ...others]);
  }, [heroes, currentHero]);

  // currentIndex와 displayHeroes로부터 focusedHero 계산
  const focusedHero = useMemo(
    () => displayHeroes[currentIndex],
    [displayHeroes, currentIndex],
  );

  return {
    heroes,
    displayHeroes,
    focusedHero,
    setHeroes,
    setDisplayHeroes,
  };
};
