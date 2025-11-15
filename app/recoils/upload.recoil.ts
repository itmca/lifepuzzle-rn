import {atom, selector} from 'recoil';

export type UploadStateType = {
  story: boolean;
  hero: boolean;
  gallery: boolean;
};

export const uploadState = atom<UploadStateType>({
  key: 'uploadState',
  default: {
    story: false,
    hero: false,
    gallery: false,
  },
});

// Backward compatibility selectors
export const isStoryUploading = selector<boolean>({
  key: 'isStoryUploading',
  get: ({get}) => get(uploadState).story,
  set: ({set, get}, newValue) => {
    const current = get(uploadState);
    set(uploadState, {
      ...current,
      story: newValue,
    });
  },
});

export const isHeroUploading = selector<boolean>({
  key: 'isHeroUploading',
  get: ({get}) => get(uploadState).hero,
  set: ({set, get}, newValue) => {
    const current = get(uploadState);
    set(uploadState, {
      ...current,
      hero: newValue,
    });
  },
});

export const isGalleryUploadingState = selector<boolean>({
  key: 'isGalleryUploadingState',
  get: ({get}) => get(uploadState).gallery,
  set: ({set, get}, newValue) => {
    const current = get(uploadState);
    set(uploadState, {
      ...current,
      gallery: newValue,
    });
  },
});
