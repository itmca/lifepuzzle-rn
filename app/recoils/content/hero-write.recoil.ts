import {atom} from 'recoil';
import {WritingHeroType} from '../../types/writing-Hero.type';

export const writingHeroState = atom<WritingHeroType>({
  key: 'writingHeroState',
  default: {
    heroNo: 0,
    heroName: '',
    heroNickName: '',
    birthday: new Date(1948, 1, 1),
    title: '',
    imageURL: undefined,
    isProfileImageUpdate: false,
  },
});

export const writingHeroKeyState = atom<number | undefined>({
  key: 'writingHeroKeyState',
  default: undefined,
});
