import { create } from 'zustand';
import {
  AgeGroupsType,
  GalleryType,
  StoryType,
  TagKey,
  TagType,
} from '../types/core/media.type';

interface MediaState {
  ageGroups: AgeGroupsType | null;
  tags: TagType[] | null;
  gallery: GalleryType[];
  galleryError: boolean;
  updateGalleryStory: (galleryId: number, story: StoryType | null) => void;
  removeGalleryItem: (galleryId: number) => GalleryType | null;
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
  updateGalleryStory: (galleryId, story) =>
    set(state => {
      if (!state.ageGroups) {
        return {};
      }

      const updatedAgeGroups = Object.entries(state.ageGroups).reduce(
        (acc, [key, group]) => {
          const updatedGallery = group.gallery.map(item =>
            item.id === galleryId
              ? {
                  ...item,
                  story: story ?? undefined,
                }
              : item,
          );
          acc[key as TagKey] = { ...group, gallery: updatedGallery };
          return acc;
        },
        {} as AgeGroupsType,
      );

      const gallery = computeGallery(updatedAgeGroups, state.tags);
      return {
        ageGroups: updatedAgeGroups,
        gallery,
      };
    }),

  removeGalleryItem: galleryId => {
    let removedItem: GalleryType | null = null;

    set(state => {
      if (!state.ageGroups) {
        return {};
      }

      const updatedAgeGroups = Object.entries(state.ageGroups).reduce(
        (acc, [key, group]) => {
          const filteredGallery = group.gallery.filter(item => {
            const shouldRemove = item.id === galleryId;
            if (shouldRemove) {
              removedItem = item;
            }
            return !shouldRemove;
          });

          acc[key as TagKey] = {
            ...group,
            gallery: filteredGallery,
            galleryCount: filteredGallery.length,
          };
          return acc;
        },
        {} as AgeGroupsType,
      );

      const updatedTags =
        state.tags?.map(tag => ({
          ...tag,
          count: updatedAgeGroups[tag.key as TagKey]?.galleryCount ?? 0,
        })) ?? state.tags;

      const gallery = computeGallery(updatedAgeGroups, updatedTags);

      return {
        ageGroups: updatedAgeGroups,
        gallery,
        tags: updatedTags,
      };
    });

    return removedItem;
  },

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
