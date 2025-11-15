import {atom} from 'recoil';
import {HeroType} from '../../types/hero.type';
import {WritingHeroType} from '../../types/writing-Hero.type';

// 조회용 Hero 상태
export const heroState = atom<HeroType | null>({
  key: 'heroState',
  default: null,
});

// 편집용 Hero 상태
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
