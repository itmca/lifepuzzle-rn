import { useMemo, useState } from 'react';
import { HeroType, HeroUserType } from '../../types/core/hero.type';
import { useAuthAxios } from '../core/auth-http.hook';
import {
  HeroesQueryResponse,
  HeroQueryResponse,
} from '../../types/hooks/hero-query.type';
import logger from '../../utils/logger';

export const useHero = (heroNo: number) => {
  const [hero, setHero] = useState<HeroType>();
  const [puzzleCnt, setPuzzleCnt] = useState<number>(0);
  const [users, setUsers] = useState<HeroUserType[]>([]);

  const [isLoading, fetchHero] = useAuthAxios<HeroQueryResponse>({
    requestOption: {
      url: `/v1/heroes/${heroNo}`,
      method: 'get',
    },
    onResponseSuccess: ({ hero, puzzleCnt, users }) => {
      setHero(hero);
      setPuzzleCnt(puzzleCnt);
      setUsers(users);
    },
    disableInitialRequest: false,
  });
  const result = useMemo(
    () => ({
      res: { hero, puzzleCnt, users, loading: isLoading },
      fetchHero,
    }),
    [hero, puzzleCnt, users, isLoading, fetchHero],
  );

  return result;
};

export const useUploadHeroes = () => {
  const [heroes, setHeroes] = useState<HeroType[]>([]);
  const [isLoading, fetchHeroes] = useAuthAxios<HeroesQueryResponse>({
    requestOption: {
      url: '/v1/heroes',
    },
    onResponseSuccess: res => {
      if (res && res.heroes) {
        let resHeroes = res.heroes
          .map(item => item.hero)
          .filter(item => item.auth != 'VIEWER');
        setHeroes(resHeroes);
      }
    },
    onError: error => {
      logger.error('Heroes query error:', error);
    },
    disableInitialRequest: false,
  });
  const result = useMemo(
    () => ({
      res: { heroes, loading: isLoading },
      fetchHeroes,
    }),
    [heroes, isLoading, fetchHeroes],
  );

  return result;
};
