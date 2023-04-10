import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {authState} from '../../recoils/auth.recoil';
import {useAuthAxios} from './network.hook';
import {UserType} from '../../types/user.type';
import {HeroType} from '../../types/hero.type';
import {useEffect} from 'react';
import {userState} from '../../recoils/user.recoil';
import {heroState} from '../../recoils/hero.recoil';
import {useUpdateObserver} from './update.hooks';
import {
  currentHeroUpdate,
  currentUserUpdate,
} from '../../recoils/update.recoil';
import {LocalStorage} from '../local-storage.service';
import {getTokenState} from '../auth.service';

export const useFetchLocalStorageUserHero = () => {
  const tokens = useRecoilValue(authState);
  const setUser = useSetRecoilState(userState);
  const [currentHero, setHero] = useRecoilState(heroState);

  const currentUserUpdateObserver = useUpdateObserver(currentUserUpdate);
  const currentHeroUpdateObserver = useUpdateObserver(currentHeroUpdate);

  const [userLoading, fetchUser] = useAuthAxios<UserType>({
    requestOption: {},
    onResponseSuccess: user => {
      const heroNo = user.recentHeroNo;
      setUser(user);
      fetchHero({url: `/heroes/${heroNo.toString()}`});
    },
    disableInitialRequest: true,
  });

  const [heroLoading, fetchHero] = useAuthAxios<HeroType>({
    requestOption: {},
    onResponseSuccess: hero => {
      setHero(hero);
    },
    disableInitialRequest: true,
  });

  useEffect(() => {
    const tokenState = getTokenState(tokens);
    if (tokenState !== 'Use') {
      return;
    }

    const userNo: number = LocalStorage.get('userNo', 'number');
    fetchUser({url: `/users/${userNo.toString()}`});
  }, [tokens, currentUserUpdateObserver]);

  useEffect(() => {
    if (currentHero.heroNo < 0) {
      return;
    }

    fetchHero({url: `/heroes/${currentHero.heroNo.toString()}`});
  }, [currentHero.heroNo, currentHeroUpdateObserver]);

  return [userLoading || heroLoading];
};
