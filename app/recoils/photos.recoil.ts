import {atom, DefaultValue, selector} from 'recoil';
import {AgeGroupsType, TagType} from '../types/photo.type';
import {
  DUMMY_AGE_GROUPS,
  DUMMY_TAGS,
} from '../constants/dummy-age-group.constant';
import {Dimensions, Image} from 'react-native';

export const selectedGalleryIndexState = atom<number>({
  key: 'selectedGalleryIndexState',
  default: undefined,
});
export const selectedTagState = atom<TagType>({
  key: 'selectedTagState',
  default: {
    key: 'under10',
    label: '~10',
  },
});
const ageGroupsInternalState = atom<AgeGroupsType>({
  key: 'ageGroupsInternalState',
  default: DUMMY_AGE_GROUPS,
});
export const ageGroupsState = selector<AgeGroupsType>({
  key: 'ageGroupsState',
  get: ({get}) => get(ageGroupsInternalState),
  set: ({get, set, reset}, newValue) => {
    if (newValue instanceof DefaultValue) {
      reset(ageGroupsInternalState);
    } else {
      const currentAgeGroups = get(ageGroupsInternalState);
      set(ageGroupsInternalState, {
        ...currentAgeGroups,
        ...newValue,
      });
    }
  },
});
export const getGallery = selector({
  key: 'currentGalleryState',
  get: ({get}) => {
    const ageGroups = get(ageGroupsState);
    const tags = get(tagState);
    const gallery = Object.entries(ageGroups)
      .map(([key, value]: [string, any]) => {
        if (key === 'totalGallery') return [];
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
const tagInternalState = atom<TagType[]>({
  key: 'tagInternalState',
  default: [...DUMMY_TAGS],
});
export const tagState = selector<TagType[]>({
  key: 'tagState',
  get: ({get}) => get(tagInternalState),
  set: ({get, set, reset}, newValue) => {
    if (newValue instanceof DefaultValue) {
      reset(tagInternalState);
    } else {
      set(tagInternalState, [...newValue]);
    }
  },
});
