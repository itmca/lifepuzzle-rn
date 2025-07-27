import {atom} from 'recoil';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';

export const selectedGalleryItemsState = atom<PhotoIdentifier[]>({
  key: 'selectedGalleryState',
  default: [],
});
export const editedGalleryItemsState = atom<PhotoIdentifier[]>({
  key: 'editedGalleryState',
  default: [],
});

export const isGalleryUploadingState = atom<boolean>({
  key: 'isGalleryUploadingState',
  default: false,
});
