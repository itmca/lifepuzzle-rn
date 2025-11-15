import {atom} from 'recoil';

export type UploadStateType = {
  story: boolean;
  hero: boolean;
  gallery: boolean;
};

export const uploadState = atom<UploadStateType>({
  key: 'uploadState',
  default: {
    story: false,
    hero: false,
    gallery: false,
  },
});

