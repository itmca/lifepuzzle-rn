import {atom} from 'recoil';

export const helpQuestionTextState = atom<string>({
  key: 'helpQuestionText',
  default: '',
});
