import {create} from 'zustand';

interface CacheState {
  heroUpdate: number;
  currentHeroUpdate: number;
  storyListUpdate: number;
  currentUserUpdate: number;
  incrementHeroUpdate: () => void;
  incrementCurrentHeroUpdate: () => void;
  incrementStoryListUpdate: () => void;
  incrementCurrentUserUpdate: () => void;
}

export const useCacheStore = create<CacheState>((set, get) => ({
  heroUpdate: 0,
  currentHeroUpdate: 0,
  storyListUpdate: 0,
  currentUserUpdate: 0,

  incrementHeroUpdate: () =>
    set(state => {
      const newValue =
        state.heroUpdate >= 10000000000000 ? 0 : state.heroUpdate + 1;
      return {heroUpdate: newValue};
    }),

  incrementCurrentHeroUpdate: () =>
    set(state => {
      const newValue =
        state.currentHeroUpdate >= 10000000000000
          ? 0
          : state.currentHeroUpdate + 1;
      return {currentHeroUpdate: newValue};
    }),

  incrementStoryListUpdate: () =>
    set(state => {
      const newValue =
        state.storyListUpdate >= 10000000000000 ? 0 : state.storyListUpdate + 1;
      return {storyListUpdate: newValue};
    }),

  incrementCurrentUserUpdate: () =>
    set(state => {
      const newValue =
        state.currentUserUpdate >= 10000000000000
          ? 0
          : state.currentUserUpdate + 1;
      return {currentUserUpdate: newValue};
    }),
}));
