import {useCacheStore} from '../../stores/cache.store';

type UpdateFunctionMap = {
  heroUpdate: () => void;
  currentHeroUpdate: () => void;
  storyListUpdate: () => void;
  currentUserUpdate: () => void;
};

export const useUpdateObserver = (updateKey: keyof UpdateFunctionMap) => {
  const state = useCacheStore();
  return state[updateKey] as number;
};

export const useUpdatePublisher = (updateKey: keyof UpdateFunctionMap) => {
  const incrementMap: UpdateFunctionMap = {
    heroUpdate: useCacheStore(state => state.incrementHeroUpdate),
    currentHeroUpdate: useCacheStore(state => state.incrementCurrentHeroUpdate),
    storyListUpdate: useCacheStore(state => state.incrementStoryListUpdate),
    currentUserUpdate: useCacheStore(state => state.incrementCurrentUserUpdate),
  };

  return incrementMap[updateKey];
};
