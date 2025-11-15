import {atom} from 'recoil';
import {HeroType} from '../../types/core/hero.type';
import {WritingHeroType} from '../../types/core/hero.type';

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
    imageUrl: undefined,
    isProfileImageUpdate: false,
  },
});

export const writingHeroKeyState = atom<number | undefined>({
  key: 'writingHeroKeyState',
  default: undefined,
});
