import {atom} from 'recoil';
import {HeroType} from '../types/hero.type';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';

export const heroState = atom<HeroType | null>({
  key: 'heroState',
  default: null,
});

export const selectedHeroPhotoState = atom<PhotoIdentifier | undefined>({
  key: 'selectedHeroPhotoState',
  default: undefined,
});
