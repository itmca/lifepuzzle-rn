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
  selectedPhotos: any[];
  openDetailBottomSheet: boolean;
  shareKey: string;

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
  setSelectedPhotos: (photos: any[]) => void;
  resetSelectedPhotos: () => void;
  setOpenDetailBottomSheet: (isOpen: boolean) => void;
  setShareKey: (key: string) => void;
  resetShareKey: () => void;
}

export const useUIStore = create<UiState>((set, get) => ({
  // Individual upload states
  isStoryUploading: false,
  isHeroUploading: false,
  isGalleryUploading: false,

  isModalOpening: false,
  selectedPhotos: [],
  openDetailBottomSheet: false,
  shareKey: '',

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

  setSelectedPhotos: selectedPhotos => set({ selectedPhotos }),

  resetSelectedPhotos: () => set({ selectedPhotos: [] }),

  setOpenDetailBottomSheet: openDetailBottomSheet =>
    set({ openDetailBottomSheet }),

  setShareKey: shareKey => set({ shareKey }),

  resetShareKey: () => set({ shareKey: '' }),
}));
