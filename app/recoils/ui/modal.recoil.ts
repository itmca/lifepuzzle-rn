import {atom} from 'recoil';

// Story related modal states
export const isModalOpening = atom<boolean>({
  key: 'isModalOpening',
  default: false,
});

export const OpenDetailBottomSheet = atom<boolean>({
  key: 'OpenDetailBottomSheet',
  default: false,
});
