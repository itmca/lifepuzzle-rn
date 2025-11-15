import {atom} from 'recoil';

export const selectedStoryKeyState = atom<string>({
  key: 'selectedStoryKeyState',
  default: '',
});
