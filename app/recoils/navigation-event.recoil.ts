import {atom} from 'recoil';

export const navigationEventState = atom<String | undefined>({
  key: 'navigationEventState',
  default: undefined,
});
