import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {authState} from '../../recoils/auth.recoil';
import {useAuthAxios} from './network.hook';
import {UserType} from '../../types/user.type';
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

    const userNo: number = LocalStorage.get('userNo', 'number');
    fetchUser({url: `/v1/users/${userNo}`});
  }, [tokens, currentUserUpdateObserver]);

  useEffect(() => {
    if (currentHero.heroNo < 0) {
      return;
    }

    fetchHero({url: `/v1/heroes/${currentHero.heroNo.toString()}`});
  }, [currentHero.heroNo, currentHeroUpdateObserver]);
};
