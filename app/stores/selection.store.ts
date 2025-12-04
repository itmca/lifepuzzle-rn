import { create } from 'zustand';
import { TagType } from '../types/core/media.type';
import { ExtendedPhotoIdentifier } from '../types/ui/photo-selector.type';

interface SelectionState {
  selectedTag: TagType | null;
  selectedGalleryItems: any[];
  editGalleryItems: ExtendedPhotoIdentifier[];
  currentGalleryIndex: number;
  selectedHeroPhoto: any;
  selectedUserPhoto: any;
  setSelectedTag: (tag: TagType | null) => void;
  setSelectedGalleryItems: (items: any[]) => void;
  setEditGalleryItems: (items: ExtendedPhotoIdentifier[]) => void;
  setCurrentGalleryIndex: (index: number) => void;
  setSelectedHeroPhoto: (photo: any) => void;
  setSelectedUserPhoto: (photo: any) => void;
  resetSelectedHeroPhoto: () => void;
  resetSelectedUserPhoto: () => void;
  resetSelection: () => void;
}

export const useSelectionStore = create<SelectionState>(set => ({
  selectedTag: null,
  selectedGalleryItems: [],
  editGalleryItems: [],
  currentGalleryIndex: 0,
  selectedHeroPhoto: undefined,
  selectedUserPhoto: undefined,

  setSelectedTag: selectedTag => set({ selectedTag }),

  setSelectedGalleryItems: selectedGalleryItems =>
    set({ selectedGalleryItems }),

  setEditGalleryItems: editGalleryItems => set({ editGalleryItems }),

  setCurrentGalleryIndex: currentGalleryIndex => set({ currentGalleryIndex }),

  setSelectedHeroPhoto: selectedHeroPhoto => set({ selectedHeroPhoto }),

  setSelectedUserPhoto: selectedUserPhoto => set({ selectedUserPhoto }),

  resetSelectedHeroPhoto: () => set({ selectedHeroPhoto: undefined }),

  resetSelectedUserPhoto: () => set({ selectedUserPhoto: undefined }),

  resetSelection: () =>
    set({
      selectedTag: null,
      selectedGalleryItems: [],
      editGalleryItems: [],
      currentGalleryIndex: 0,
      selectedHeroPhoto: undefined,
      selectedUserPhoto: undefined,
    }),
}));
