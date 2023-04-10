import {atom} from 'recoil';

export const SelectedCategoryState = atom<String>({
  key: 'SelectedCategoryState',
  default: 'all',
});
