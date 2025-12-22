import { HeroType, HeroWithPuzzleCntType } from '../types/core/hero.type.ts';
import { HeroQueryResponse } from '../types/hooks/hero-query.type.ts';

/**
 * HeroQueryResponse를 HeroWithPuzzleCntType으로 변환
 * HeroSettingPage와 useHeroes에서 공통으로 사용
 */
export const transformHeroQueryResponse = (
  response: HeroQueryResponse,
): HeroWithPuzzleCntType => {
  return {
    ...response.hero,
    puzzleCount: response.puzzleCnt,
    users: response.users,
  };
};

/**
 * HeroQueryResponse 배열을 HeroWithPuzzleCntType 배열로 변환
 */
export const transformHeroesQueryResponse = (
  responses: HeroQueryResponse[],
): HeroWithPuzzleCntType[] => {
  return responses.map(transformHeroQueryResponse);
};

/**
 * HeroQueryResponse 배열에서 HeroType 배열만 추출하고 VIEWER 제외
 */
export const extractHeroesFromQueryResponse = (
  responses: HeroQueryResponse[],
): HeroType[] => {
  return responses
    .map(item => item.hero)
    .filter(item => item.auth !== 'VIEWER');
};
