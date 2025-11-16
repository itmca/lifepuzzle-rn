import {useAuthStore} from '../../stores/auth.store';
import {useUserStore} from '../../stores/user.store';
import {useAuthAxios} from '../core/auth-http.hook';
import {UserType} from '../../types/core/user.type';
import {useEffect} from 'react';
import {useHeroStore} from '../../stores/hero.store';
import {useUpdateObserver} from '../common/update.hook';
import {LocalStorage} from './local-storage.service';
import {getTokenState} from './auth.service';
import {HeroQueryResponse} from '../hero/hero.query.hook';

export const useFetchLocalStorageUserHero = (): void => {
  const tokens = useAuthStore(state => state.authTokens);
  const setUser = useUserStore(state => state.setUser);
  const currentHero = useHeroStore(state => state.currentHero);
  const setHero = useHeroStore(state => state.setCurrentHero);

  const currentUserUpdateObserver = useUpdateObserver('currentUserUpdate');
  const currentHeroUpdateObserver = useUpdateObserver('currentHeroUpdate');

  const [, fetchUser] = useAuthAxios<UserType>({
    requestOption: {},
    onResponseSuccess: user => {
      const heroNo = user.recentHeroNo;
      setUser(user);
      fetchHero({url: `/v1/heroes/${heroNo.toString()}`});
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

    fetchUser({url: `/v1/users/${userNo}`});
  }, [tokens, currentUserUpdateObserver, fetchUser]);

  useEffect(() => {
    if (!currentHero || currentHero.heroNo < 0) {
      return;
    }

    fetchHero({url: `/v1/heroes/${currentHero.heroNo.toString()}`});
  }, [currentHero, currentHeroUpdateObserver, fetchHero]);
};
