import {atom} from 'recoil';

export const heroUpdate = atom<number>({
  key: 'heroUpdate',
  default: 0,
});

export const currentHeroUpdate = atom<number>({
  key: 'currentHeroUpdate',
  default: 0,
});

export const storyListUpdate = atom<number>({
  key: 'storyListUpdate',
  default: 0,
});

export const currentUserUpdate = atom<number>({
  key: 'currentUserUpdate',
  default: 0,
});
