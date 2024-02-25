import {atom, selector} from 'recoil';
import {HeroType} from '../types/hero.type';
import {DUMMY_HERO} from '../constants/dummy.constant';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';

export const heroState = atom<HeroType>({
  key: 'heroState',
  default: DUMMY_HERO,
});
export const selectedHeroPhotoState = atom<PhotoIdentifier | undefined>({
  key: 'selectedHeroPhotoState',
  default: undefined,
});
