import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {atom} from 'recoil';

export const photoState = atom<PhotoIdentifier[]>({
  key: 'photoState',
  default: [],
});

export const videoState = atom<PhotoIdentifier[]>({
  key: 'videoState',
  default: [],
});

export const selectedPhotoState = atom<PhotoIdentifier[]>({
  key: 'selectedPhotoState',
  default: [],
});

export const selectedVideoState = atom<PhotoIdentifier[]>({
  key: 'selectedVideoState',
  default: [],
});
