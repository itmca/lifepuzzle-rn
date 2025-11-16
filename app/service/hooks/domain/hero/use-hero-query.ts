import {useMemo, useState} from 'react';
import {useApi} from '../../core/use-api';
import {createApiHook, createCrudHook} from '../../core/api-hook.factory';
import {HeroType, HeroUserType} from '../../../../types/core/hero.type';
import {
  HeroQueryResponse,
  HeroesQueryResponse,
} from '../../../../types/hooks/hero-query.type';

// 단일 Hero 조회
export const useHero = (heroNo: number, enabled = true) => {
  const api = useApi();

  const heroHook = useMemo(
    () =>
      createApiHook<HeroQueryResponse>(api, {
        url: `/v1/heroes/${heroNo}`,
        method: 'GET',
        entityName: '주인공',
        enabled,
      }),
    [api, heroNo, enabled],
  );

  const hookResult = heroHook();

  const result = useMemo(
    () => ({
      hero: hookResult.data?.hero,
      puzzleCnt: hookResult.data?.puzzleCnt || 0,
      users: hookResult.data?.users || [],
      loading: hookResult.loading,
      error: hookResult.error,
      refetch: hookResult.execute,
    }),
    [hookResult],
  );

  return result;
};

// 업로드 가능한 Heroes 목록 조회
export const useUploadHeroes = () => {
  const api = useApi();
  const [filteredHeroes, setFilteredHeroes] = useState<HeroType[]>([]);

  const heroesHook = useMemo(
    () =>
      createApiHook<HeroesQueryResponse>(api, {
        url: '/v1/heroes',
        method: 'GET',
        entityName: '주인공 목록',
        onSuccess: response => {
          if (response?.heroes) {
            const filtered = response.heroes
              .map(item => item.hero)
              .filter(item => item.auth !== 'VIEWER');
            setFilteredHeroes(filtered);
          }
        },
      }),
    [api],
  );

  const hookResult = heroesHook();

  const result = useMemo(
    () => ({
      heroes: filteredHeroes,
      loading: hookResult.loading,
      error: hookResult.error,
      refetch: hookResult.execute,
    }),
    [filteredHeroes, hookResult],
  );

  return result;
};

// Hero CRUD Hook
export const useHeroCrud = () => {
  const api = useApi();

  const crudHook = useMemo(
    () =>
      createCrudHook<HeroType>(api, {
        endpoint: '/v1/heroes',
        entityName: '주인공',
      }),
    [api],
  );

  return crudHook();
};
