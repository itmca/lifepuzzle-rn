import { create } from 'zustand';
import { AgeGroupsType, TagType, GalleryType } from '../types/core/media.type';

interface MediaState {
  ageGroups: AgeGroupsType | null;
  tags: TagType[] | null;
  gallery: GalleryType[];
  galleryError: boolean;
  setAgeGroups: (ageGroups: AgeGroupsType | null) => void;
  setTags: (tags: TagType[] | null) => void;
  setGalleryError: (error: boolean) => void;
  resetAgeGroups: () => void;
  resetTags: () => void;
  getGallery: () => GalleryType[]; // @deprecated Use gallery state directly
}

const computeGallery = (
  ageGroups: AgeGroupsType | null,
  tags: TagType[] | null,
): GalleryType[] => {
  if (!ageGroups || !tags) {
    return [];
  }

  return Object.entries(ageGroups)
    .map(([key, value]) => {
      const matchedTag = tags.find(t => t.key === key);
      if (!matchedTag) return [];
      return value.gallery.map(item => ({
        ...item,
        tag: matchedTag,
      }));
    })
    .flat();
};

export const useMediaStore = create<MediaState>((set, get) => ({
  ageGroups: null,
  tags: null,
  gallery: [],
  galleryError: false,

  setAgeGroups: ageGroups => {
    const { tags } = get();
    const gallery = computeGallery(ageGroups, tags);
    set({ ageGroups, gallery });
  },

  setTags: tags => {
    const { ageGroups } = get();
    const gallery = computeGallery(ageGroups, tags);
    set({ tags, gallery });
  },

  setGalleryError: galleryError => set({ galleryError }),

  resetAgeGroups: () => {
    set({ ageGroups: null, gallery: [] });
  },

  resetTags: () => {
    set({ tags: null, gallery: [] });
  },

  getGallery: () => {
    // @deprecated: Use gallery state directly instead
    return get().gallery;
  },
}));
