import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {atom, selector} from 'recoil';

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

export const mainSelectedPhotoState = selector({
  key: 'mainSelectedPhotoState',
  get: ({get}) => {
    const list = get(selectedPhotoState);
    return list[list.length - 1];
  },
});
export const selectedVideoState = atom<PhotoIdentifier[]>({
  key: 'selectedVideoState',
  default: [],
});

export const mainSelectedVideoState = selector({
  key: 'mainSelectedVideoState',
  get: ({get}) => {
    const list = get(selectedPhotoState);
    return list[list.length - 1];
  },
});
