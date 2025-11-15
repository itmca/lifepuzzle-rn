import {atom} from 'recoil';
import {HeroType} from '../../types/hero.type';

export const heroState = atom<HeroType | null>({
  key: 'heroState',
  default: null,
});
