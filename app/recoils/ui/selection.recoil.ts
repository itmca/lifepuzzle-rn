import {atom, selector} from 'recoil';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {TagType} from '../../types/photo.type';

export type SelectionStateType = {
  user?: PhotoIdentifier;
  hero?: PhotoIdentifier;
  gallery: PhotoIdentifier[];
  editedGallery: PhotoIdentifier[];
  currentGalleryIndex: number;
  tag: TagType | null;
};

export const selectionState = atom<SelectionStateType>({
  key: 'selectionState',
  default: {
    gallery: [],
    editedGallery: [],
    currentGalleryIndex: 0,
    tag: null,
  },
});

// Backward compatibility selectors
export const selectedUserPhotoState = selector<PhotoIdentifier | undefined>({
  key: 'selectedUserPhotoState',
  get: ({get}) => get(selectionState).user,
  set: ({set, get}, newValue) => {
    const current = get(selectionState);
    set(selectionState, {
      ...current,
      user: newValue,
    });
  },
});

export const selectedHeroPhotoState = selector<PhotoIdentifier | undefined>({
  key: 'selectedHeroPhotoState',
  get: ({get}) => get(selectionState).hero,
  set: ({set, get}, newValue) => {
    const current = get(selectionState);
    set(selectionState, {
      ...current,
      hero: newValue,
    });
  },
});

export const selectedGalleryItemsState = selector<PhotoIdentifier[]>({
  key: 'selectedGalleryState',
  get: ({get}) => get(selectionState).gallery,
  set: ({set, get}, newValue) => {
    const current = get(selectionState);
    set(selectionState, {
      ...current,
      gallery: newValue,
    });
  },
});

export const editedGalleryItemsState = selector<PhotoIdentifier[]>({
  key: 'editedGalleryState',
  get: ({get}) => get(selectionState).editedGallery,
  set: ({set, get}, newValue) => {
    const current = get(selectionState);
    set(selectionState, {
      ...current,
      editedGallery: newValue,
    });
  },
});

export const selectedGalleryIndexState = selector<number>({
  key: 'selectedGalleryIndexState',
  get: ({get}) => get(selectionState).currentGalleryIndex,
  set: ({set, get}, newValue) => {
    const current = get(selectionState);
    set(selectionState, {
      ...current,
      currentGalleryIndex: newValue,
    });
  },
});

export const selectedTagState = selector<TagType | null>({
  key: 'selectedTagState',
  get: ({get}) => get(selectionState).tag,
  set: ({set, get}, newValue) => {
    const current = get(selectionState);
    set(selectionState, {
      ...current,
      tag: newValue,
    });
  },
});
