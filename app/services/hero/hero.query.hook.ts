import { useEffect, useMemo, useState } from 'react';
import { HeroType } from '../../types/core/hero.type.ts';
import {
  HeroesQueryResponse,
  HeroQueryResponse,
} from '../../types/hooks/hero-query.type.ts';
import logger from '../../utils/logger.util.ts';
import { useAuthQuery } from '../core/auth-query.hook.ts';

export const useHero = (
  heroNo: number,
): [HeroType | undefined, isLoading: boolean] => {
  const [hero, setHero] = useState<HeroType>();

  const { isFetching: isLoading, refetch } = useAuthQuery<HeroQueryResponse>({
    queryKey: ['hero', heroNo],
    axiosConfig: {
      url: `/v1/heroes/${heroNo}`,
      method: 'get',
    },
    enabled: heroNo >= 0,
    onSuccess: ({ hero }) => {
      setHero(hero);
    },
    onError: err => {
      logger.error(err);
    },
  });

  // heroNo가 변경될 때마다 요청
  useEffect(() => {
    if (heroNo >= 0) {
      refetch();
    }
  }, [heroNo, refetch]);

  return [hero, isLoading];
};

export const useUploadHeroes = () => {
  const [heroes, setHeroes] = useState<HeroType[]>([]);
  const { isFetching: isLoading, refetch: fetchHeroes } =
    useAuthQuery<HeroesQueryResponse>({
      queryKey: ['heroes'],
      axiosConfig: {
        url: '/v1/heroes',
      },
      onSuccess: res => {
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
