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

export const wrtingHeroState = atom<HeroType>({
  key: 'wrtingHeroState',
  default: {
    heroNo: -1,
    heroName: '',
    heroNickName: '',
    birthday: new Date(1948, 1, 1),
    title: '',
    imageURL: undefined,
    modifiedImage: undefined,
  },
});

export const getCurrentHeroPhotoUri = selector({
  key: 'currentHeroPhotoUriState',
  get: ({get}) => {
    const hero = get(wrtingHeroState);

    if (!hero) return;

    const modifiedImage = hero.modifiedImage;
    const currentHeroPhotoUri = modifiedImage
      ? modifiedImage.node.image.uri
      : hero.imageURL;

    return currentHeroPhotoUri;
  },
});
