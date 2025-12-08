import { useAuthStore } from '../../stores/auth.store.ts';
import { useUserStore } from '../../stores/user.store.ts';
import { useAuthAxios } from './auth-http.hook.ts';
import { UserType } from '../../types/core/user.type.ts';
import { useEffect, useRef } from 'react';
import { useHeroStore } from '../../stores/hero.store.ts';
import { useUpdateObserver } from '../common/update.hook.ts';
import { LocalStorage } from './local-storage.service.ts';
import { getTokenState } from './auth.service.ts';
import { HeroQueryResponse } from '../../types/hooks/hero-query.type.ts';

export const useFetchLocalStorageUserHero = (): void => {
  const tokens = useAuthStore(state => state.authTokens);
  const setUser = useUserStore(state => state.setUser);
  const currentHero = useHeroStore(state => state.currentHero);
  const setHero = useHeroStore(state => state.setCurrentHero);

  const currentUserUpdateObserver = useUpdateObserver('currentUserUpdate');
  const currentHeroUpdateObserver = useUpdateObserver('currentHeroUpdate');

  // Use ref to store heroNo to avoid triggering useEffect when hero data changes
  const heroNoRef = useRef(currentHero?.id);

  const [, fetchUser] = useAuthAxios<UserType>({
    requestOption: {},
    onResponseSuccess: user => {
      const heroNo = user.recentHeroNo;
      setUser(user);
      fetchHero({ url: `/v1/heroes/${heroNo.toString()}` });
    },
    disableInitialRequest: true,
  });

  const [, fetchHero] = useAuthAxios<HeroQueryResponse>({
    requestOption: {},
    onResponseSuccess: res => {
      setHero(res.hero);
    },
    disableInitialRequest: true,
  });

  useEffect(() => {
    const tokenState = getTokenState(tokens);
    if (tokenState === 'Expire') {
      return;
    }

    const userNo: number | undefined = LocalStorage.get('userNo', 'number');
    if (!userNo || userNo < 0) {
      return;
    }

    fetchUser({ url: `/v1/users/${userNo}` });
  }, [tokens, currentUserUpdateObserver, fetchUser]);

  // Update heroNo ref when currentHero changes
  useEffect(() => {
    if (currentHero?.id !== undefined) {
      heroNoRef.current = currentHero.id;
    }
  }, [currentHero?.id]);

  // Only refetch when currentHeroUpdateObserver changes, not when hero data changes
  useEffect(() => {
    const heroNo = heroNoRef.current;
    if (heroNo === undefined || heroNo < 0) {
      return;
    }

    fetchHero({ url: `/v1/heroes/${heroNo.toString()}` });
  }, [currentHeroUpdateObserver, fetchHero]);
};
