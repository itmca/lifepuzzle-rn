import {atom} from 'recoil';

export const shareKeyState = atom<string>({
  key: 'shareKeyState',
  default: undefined,
});
