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
