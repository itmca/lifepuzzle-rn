import {atom} from 'recoil';
import {SharePhoto} from '../types/photo.type';

export const shareKeyState = atom<string>({
  key: 'shareKeyState',
  default: undefined,
});

export const sharedImageDataState = atom<SharePhoto>({
  key: 'sharedImageDataState',
  default: {} as SharePhoto,
});
