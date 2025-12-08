import { useEffect, useMemo, useState } from 'react';
import { HeroType } from '../../types/core/hero.type.ts';
import { useAuthAxios } from '../core/auth-http.hook.ts';
import {
  HeroesQueryResponse,
  HeroQueryResponse,
} from '../../types/hooks/hero-query.type.ts';
import logger from '../../utils/logger.ts';

export const useHero = (
  heroNo: number,
): [HeroType | undefined, isLoading: boolean] => {
  const [hero, setHero] = useState<HeroType>();

  const [isLoading, refetch] = useAuthAxios<HeroQueryResponse>({
    requestOption: {
      url: `/v1/heroes/${heroNo}`,
      method: 'get',
    },
    onResponseSuccess: ({ hero }) => {
      setHero(hero);
    },
    onError: err => {
      logger.error(err);
    },
    disableInitialRequest: true,
  });

  // heroNo가 변경될 때마다 요청
  useEffect(() => {
    refetch({ url: `/v1/heroes/${heroNo}` });
  }, [heroNo, refetch]);

  return [hero, isLoading];
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
