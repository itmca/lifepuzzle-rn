import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';

import {atom, selector} from 'recoil';
import {MediaInfo} from '../types/writing-story.type';

export const selectedPhotoState = atom<MediaInfo[]>({
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
export const selectedVideoState = atom<MediaInfo[]>({
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
