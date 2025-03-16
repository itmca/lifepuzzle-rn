import {useState} from 'react';
import {HeroType, HeroUserType} from '../../types/Hero.type';
import {useAuthAxios} from './network.hook';

export type HeroesQueryResponse = {
  heroes: HeroQueryResponse[];
};

export type HeroQueryResponse = {
  hero: HeroType;
  puzzleCnt: number;
  users: HeroUserType[];
};

export const useHero = (heroNo: number) => {
  const [hero, setHero] = useState<HeroType>();
  const [puzzleCnt, setPuzzleCnt] = useState<number>(0);
  const [users, setUsers] = useState<HeroUserType[]>([]);

  const [isLoading, fetchHero] = useAuthAxios<HeroQueryResponse>({
    requestOption: {
      url: `/v1/heroes/${heroNo}`,
      method: 'get',
    },
    onResponseSuccess: ({hero, puzzleCnt, users}) => {
      setHero(hero);
      setPuzzleCnt(puzzleCnt);
      setUsers(users);
    },
    disableInitialRequest: false,
  });
  return {
    res: {hero: hero, puzzleCnt: puzzleCnt, users: users, loading: isLoading},
    fetchHero,
  };
};
