import {create} from 'zustand';

export type UploadStateType = {
  story: boolean;
  hero: boolean;
  gallery: boolean;
};

interface UiState {
  uploadState: UploadStateType;
  isModalOpening: boolean;
  selectedPhotos: any[];
  openDetailBottomSheet: boolean;
  shareKey: string;
  setUploadState: (state: Partial<UploadStateType>) => void;
  resetUploadState: () => void;
  setModalOpen: (isOpen: boolean) => void;
  setSelectedPhotos: (photos: any[]) => void;
  resetSelectedPhotos: () => void;
  setOpenDetailBottomSheet: (isOpen: boolean) => void;
  setShareKey: (key: string) => void;
  resetShareKey: () => void;
}

const defaultUploadState: UploadStateType = {
  story: false,
  hero: false,
  gallery: false,
};

export const useUIStore = create<UiState>((set, get) => ({
  uploadState: defaultUploadState,
  isModalOpening: false,
  selectedPhotos: [],
  openDetailBottomSheet: false,
  shareKey: '',

  setUploadState: newState =>
    set(state => ({
      uploadState: {...state.uploadState, ...newState},
    })),

  resetUploadState: () => set({uploadState: defaultUploadState}),

  setModalOpen: isModalOpening => set({isModalOpening}),

  setSelectedPhotos: selectedPhotos => set({selectedPhotos}),

  resetSelectedPhotos: () => set({selectedPhotos: []}),

  setOpenDetailBottomSheet: openDetailBottomSheet =>
    set({openDetailBottomSheet}),

  setShareKey: shareKey => set({shareKey}),

  resetShareKey: () => set({shareKey: ''}),
}));
