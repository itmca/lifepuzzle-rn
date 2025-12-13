import { create } from 'zustand';

// Deprecated: Use individual upload state fields instead
export type UploadStateType = {
  story: boolean;
  hero: boolean;
  gallery: boolean;
};

interface UiState {
  // Individual upload states (optimized for selective re-renders)
  isStoryUploading: boolean;
  isHeroUploading: boolean;
  isGalleryUploading: boolean;

  isModalOpening: boolean;
  openDetailBottomSheet: boolean;

  // Individual upload state setters
  setStoryUploading: (isUploading: boolean) => void;
  setHeroUploading: (isUploading: boolean) => void;
  setGalleryUploading: (isUploading: boolean) => void;

  // Deprecated: Backward compatibility wrapper
  /** @deprecated Use setStoryUploading, setHeroUploading, setGalleryUploading instead */
  setUploadState: (state: Partial<UploadStateType>) => void;
  /** @deprecated Use individual upload state fields instead */
  resetUploadState: () => void;

  setModalOpen: (isOpen: boolean) => void;
  setOpenDetailBottomSheet: (isOpen: boolean) => void;
}

export const useUIStore = create<UiState>(set => ({
  // Individual upload states
  isStoryUploading: false,
  isHeroUploading: false,
  isGalleryUploading: false,

  isModalOpening: false,
  openDetailBottomSheet: false,

  // Individual setters
  setStoryUploading: isStoryUploading => set({ isStoryUploading }),
  setHeroUploading: isHeroUploading => set({ isHeroUploading }),
  setGalleryUploading: isGalleryUploading => set({ isGalleryUploading }),

  // Deprecated: Backward compatibility wrapper
  setUploadState: newState => {
    const updates: Partial<UiState> = {};
    if ('story' in newState) updates.isStoryUploading = newState.story;
    if ('hero' in newState) updates.isHeroUploading = newState.hero;
    if ('gallery' in newState) updates.isGalleryUploading = newState.gallery;
    set(updates);
  },

  resetUploadState: () =>
    set({
      isStoryUploading: false,
      isHeroUploading: false,
      isGalleryUploading: false,
    }),

  setModalOpen: isModalOpening => set({ isModalOpening }),

  setOpenDetailBottomSheet: openDetailBottomSheet =>
    set({ openDetailBottomSheet }),
}));
