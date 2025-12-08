import { create } from 'zustand';
import { SharePhoto } from '../types/core/media.type';

interface ShareState {
  shareKey: string;
  sharedImageData: SharePhoto;
  setShareKey: (key: string) => void;
  setSharedImageData: (data: SharePhoto) => void;
  resetShare: () => void;
}

const defaultSharedImageData: SharePhoto = {
  type: '',
  uri: '',
  uriList: [],
};

export const useShareStore = create<ShareState>(set => ({
  shareKey: '',
  sharedImageData: defaultSharedImageData,

  setShareKey: shareKey => set({ shareKey }),

  setSharedImageData: sharedImageData => set({ sharedImageData }),

  resetShare: () =>
    set({
      shareKey: '',
      sharedImageData: defaultSharedImageData,
    }),
}));
