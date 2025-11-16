import {create} from 'zustand';
import {AgeGroupsType, TagType, GalleryType} from '../types/core/media.type';

interface MediaState {
  ageGroups: AgeGroupsType | null;
  tags: TagType[] | null;
  galleryError: boolean;
  setAgeGroups: (ageGroups: AgeGroupsType | null) => void;
  setTags: (tags: TagType[] | null) => void;
  setGalleryError: (error: boolean) => void;
  resetAgeGroups: () => void;
  resetTags: () => void;
  getGallery: () => GalleryType[];
}

export const useMediaStore = create<MediaState>((set, get) => ({
  ageGroups: null,
  tags: null,
  galleryError: false,

  setAgeGroups: ageGroups => set({ageGroups}),

  setTags: tags => set({tags}),

  setGalleryError: galleryError => set({galleryError}),

  resetAgeGroups: () => set({ageGroups: null}),

  resetTags: () => set({tags: null}),

  getGallery: () => {
    const {ageGroups, tags} = get();

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
}));
