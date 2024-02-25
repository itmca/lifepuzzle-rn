import {atom, DefaultValue, selector} from 'recoil';
import {WritingHeroType} from '../types/writing-Hero.type';

const writingHeroInternalState = atom<WritingHeroType>({
  key: 'writingHeroInternalState',
  default: {
    heroNo: 0,
    heroName: '',
    heroNickName: '',
    birthday: new Date(1948, 1, 1),
    title: '',
    imageURL: undefined,
  },
});
export const writingHeroKeyState = atom<number>({
  key: 'writingHeroKeyState',
  default: undefined,
});
export const writingHeroState = selector<WritingHeroType>({
  key: 'writingHeroState',
  get: ({get}) => get(writingHeroInternalState),
  set: ({get, set, reset}, newValue) => {
    if (newValue instanceof DefaultValue) {
      reset(writingHeroInternalState);
    } else {
      const currentWritingHero = get(writingHeroInternalState);
      set(writingHeroInternalState, {
        ...currentWritingHero,
        ...newValue,
      });
    }
  },
});
export const getCurrentHeroPhotoUri = selector({
  key: 'currentHeroPhotoUriState',
  get: ({get}) => {
    const hero = get(writingHeroState);

    if (!hero) return;
    const currentHeroPhotoUri = hero.imageURL?.node.image.uri;
    return currentHeroPhotoUri;
  },
});

export const isHeroUploading = atom<boolean>({
  key: 'isHeroUploading',
  default: false,
});
