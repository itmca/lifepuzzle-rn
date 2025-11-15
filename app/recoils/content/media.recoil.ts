import {atom, DefaultValue, selector} from 'recoil';
import {AgeGroupsType, TagType} from '../../types/photo.type';

// Re-export from selection.recoil for backward compatibility
export {
  selectedGalleryIndexState,
  selectedTagState,
} from '../ui/selection.recoil';
const ageGroupsInternalState = atom<AgeGroupsType | null>({
  key: 'ageGroupsInternalState',
  default: null,
});
export const ageGroupsState = selector<AgeGroupsType | null>({
  key: 'ageGroupsState',
  get: ({get}) => get(ageGroupsInternalState),
  set: ({get, set, reset}, newValue) => {
    if (newValue instanceof DefaultValue) {
      reset(ageGroupsInternalState);
    } else {
      set(
        ageGroupsInternalState,
        newValue
          ? {
              ...newValue,
            }
          : null,
      );
    }
  },
});
export const getGallery = selector({
  key: 'currentGalleryState',
  get: ({get}) => {
    const ageGroups = get(ageGroupsState);
    const tags = get(tagState);

    if (!ageGroups || !tags) {
      return [];
    }

    const gallery = Object.entries(ageGroups)
      .map(([key, value]: [string, any]) => {
        const tag = tags.find((tag: any) => tag.key === key);
        return value.gallery.map((item: any) => ({
          ...item,
          tag,
        }));
      })
      .flat();
    return gallery;
  },
});
const tagInternalState = atom<TagType[] | null>({
  key: 'tagInternalState',
  default: null,
});
export const tagState = selector<TagType[] | null>({
  key: 'tagState',
  get: ({get}) => get(tagInternalState),
  set: ({get, set, reset}, newValue) => {
    if (newValue instanceof DefaultValue) {
      reset(tagInternalState);
    } else {
      set(tagInternalState, newValue ? [...newValue] : null);
    }
  },
});

export const galleryErrorState = atom<boolean>({
  key: 'galleryErrorState',
  default: false,
});
