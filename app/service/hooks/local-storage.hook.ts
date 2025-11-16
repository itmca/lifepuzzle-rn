import {authState} from '../../recoils/auth/auth.recoil';
import {userState} from '../../recoils/auth/user.recoil';
import {useAuthAxios} from './network.hook';
import {UserType} from '../../types/core/user.type';
import {useEffect} from 'react';
import {heroState} from '../../recoils/content/hero.recoil';
import {useUpdateObserver} from './update.hook';
import {
  currentHeroUpdate,
  currentUserUpdate,
} from '../../recoils/shared/cache.recoil';
import {LocalStorage} from '../local-storage.service';
import {getTokenState} from '../auth.service';
import {HeroQueryResponse} from './hero.query.hook';

export const useFetchLocalStorageUserHero = (): void => {
  const tokens = useRecoilValue(authState);
  const setUser = useSetRecoilState(userState);
  const [currentHero, setHero] = useRecoilState(heroState);

  const currentUserUpdateObserver = useUpdateObserver(currentUserUpdate);
  const currentHeroUpdateObserver = useUpdateObserver(currentHeroUpdate);

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
