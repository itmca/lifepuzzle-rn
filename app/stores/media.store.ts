import { create } from 'zustand';
import {
  AgeGroupsType,
  AgeType,
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
  updateGalleryDateAndTag: (
    galleryId: number,
    date: Date,
    newTagKey: AgeType,
  ) => void;
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

  updateGalleryDateAndTag: (galleryId, date, newTagKey) =>
    set(state => {
      if (!state.ageGroups || !state.tags) {
        return {};
      }

      // 1. 해당 gallery item 찾기
      let targetItem: GalleryType | null = null;
      let oldTagKey: TagKey | null = null;

      for (const [key, group] of Object.entries(state.ageGroups)) {
        const found = group.gallery.find(item => item.id === galleryId);
        if (found) {
          targetItem = found;
          oldTagKey = key as TagKey;
          break;
        }
      }

      if (!targetItem || !oldTagKey) {
        return {};
      }

      // 2. 새로운 tag 정보 찾기
      const newTag = state.tags.find(tag => tag.key === newTagKey);
      if (!newTag) {
        return {};
      }

      // 3. 업데이트된 item 생성
      const updatedItem: GalleryType = {
        ...targetItem,
        date,
        tag: newTag,
      };

      // 4. ageGroups 업데이트
      const updatedAgeGroups = { ...state.ageGroups };

      // 기존 위치에서 제거
      const oldGroup = updatedAgeGroups[oldTagKey];
      if (oldGroup) {
        const filteredGallery = oldGroup.gallery.filter(
          item => item.id !== galleryId,
        );
        updatedAgeGroups[oldTagKey] = {
          ...oldGroup,
          startYear: oldGroup.startYear,
          endYear: oldGroup.endYear,
          gallery: filteredGallery,
          galleryCount: filteredGallery.length,
        };
      }

      // 새로운 위치에 추가
      if (updatedAgeGroups[newTagKey]) {
        updatedAgeGroups[newTagKey] = {
          ...updatedAgeGroups[newTagKey],
          gallery: [...updatedAgeGroups[newTagKey].gallery, updatedItem],
          galleryCount: updatedAgeGroups[newTagKey].gallery.length + 1,
        };
      } else {
        // 새로운 ageGroup 생성 (해당 나이대 첫 번째 아이템인 경우)
        updatedAgeGroups[newTagKey] = {
          startYear: 0, // 실제로는 백엔드에서 계산
          endYear: 0,
          galleryCount: 1,
          gallery: [updatedItem],
        };
      }

      // 5. tags 업데이트 (count)
      const updatedTags = state.tags.map(tag => ({
        ...tag,
        count: updatedAgeGroups[tag.key as TagKey]?.galleryCount ?? 0,
      }));

      // 6. gallery 재계산
      const gallery = computeGallery(updatedAgeGroups, updatedTags);

      return {
        ageGroups: updatedAgeGroups,
        tags: updatedTags,
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
