import { HeroType, HeroUserType } from '../core/hero.type';

export type HeroesQueryResponse = {
  heroes: HeroQueryResponse[];
};

export type HeroQueryResponse = {
  hero: HeroType;
  puzzleCnt: number;
  users: HeroUserType[];
};
