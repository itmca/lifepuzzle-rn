import { create } from 'zustand';
import { TagType } from '../types/core/media.type';
import { ExtendedPhotoIdentifier } from '../types/ui/photo-selector.type';

interface SelectionState {
  selectedTag: TagType | null;
  selectedGalleryItems: any[];
  editGalleryItems: ExtendedPhotoIdentifier[];
  currentGalleryIndex: number;
  setSelectedTag: (tag: TagType | null) => void;
  setSelectedGalleryItems: (items: any[]) => void;
  setEditGalleryItems: (items: ExtendedPhotoIdentifier[]) => void;
  setCurrentGalleryIndex: (index: number) => void;
  resetSelection: () => void;
}

export const useSelectionStore = create<SelectionState>(set => ({
  selectedTag: null,
  selectedGalleryItems: [],
  editGalleryItems: [],
  currentGalleryIndex: 0,

  setSelectedTag: selectedTag => set({ selectedTag }),

  setSelectedGalleryItems: selectedGalleryItems =>
    set({ selectedGalleryItems }),

  setEditGalleryItems: editGalleryItems => set({ editGalleryItems }),

  setCurrentGalleryIndex: currentGalleryIndex => set({ currentGalleryIndex }),

  resetSelection: () =>
    set({
      selectedTag: null,
      selectedGalleryItems: [],
      editGalleryItems: [],
      currentGalleryIndex: 0,
    }),
}));
