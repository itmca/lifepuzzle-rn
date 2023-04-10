import {atom} from 'recoil';

export const helpQuestionTextState = atom<string>({
  key: 'helpQuestionText',
  default: '',
});

export const helpQuestionOpenState = atom<boolean>({
  key: 'helpQuestionOpen',
  default: true,
});
