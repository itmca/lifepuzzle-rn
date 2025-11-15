import {atom, selector} from 'recoil';
import {AgeGroupsType, TagType} from '../../types/core/media.type';

export const ageGroupsState = atom<AgeGroupsType | null>({
  key: 'ageGroupsState',
  default: null,
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
      .map(([key, value]) => {
        const tag = tags.find(tag => tag.key === key);
        return value.gallery.map(item => ({
          ...item,
          tag,
        }));
      })
      .flat();
    return gallery;
  },
});
export const tagState = atom<TagType[] | null>({
  key: 'tagState',
  default: null,
});

export const galleryErrorState = atom<boolean>({
  key: 'galleryErrorState',
  default: false,
});
