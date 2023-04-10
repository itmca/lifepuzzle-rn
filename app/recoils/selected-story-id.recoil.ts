import {atom} from 'recoil';

export const SelectedStoryKeyState = atom<string>({
  key: 'SelectedStoryKeyState',
  default: '',
});
