import {create} from 'zustand';
import {HeroType, WritingHeroType} from '../types/core/hero.type';

interface HeroState {
  currentHero: HeroType | null;
  writingHero: WritingHeroType;
  writingHeroKey: number | undefined;
  setCurrentHero: (hero: HeroType | null) => void;
  setWritingHero: (writingHero: WritingHeroType) => void;
  resetHero: () => void;
  resetWritingHero: () => void;
  setWritingHeroKey: (key: number | undefined) => void;
}

const defaultWritingHero: WritingHeroType = {
  heroNo: 0,
  heroName: '',
  heroNickName: '',
  birthday: new Date(1948, 1, 1),
  title: '',
  imageUrl: undefined,
  isProfileImageUpdate: false,
};

export const useHeroStore = create<HeroState>(set => ({
  currentHero: null,
  writingHero: defaultWritingHero,
  writingHeroKey: undefined,

  setCurrentHero: currentHero => set({currentHero}),

  setWritingHero: writingHero => set({writingHero}),

  resetHero: () => set({currentHero: null, writingHeroKey: undefined}),

  resetWritingHero: () => set({writingHero: defaultWritingHero}),

  setWritingHeroKey: writingHeroKey => set({writingHeroKey}),
}));
