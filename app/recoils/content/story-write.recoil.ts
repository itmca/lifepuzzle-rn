import {atom} from 'recoil';
import {PlayInfo, WritingStoryType} from '../../types/writing-story.type';

export const writingStoryState = atom<WritingStoryType>({
  key: 'writingStoryState',
  default: {},
});

export const playInfoState = atom<PlayInfo>({
  key: 'playInfoState',
  default: {},
});
export const postStoryKeyState = atom<string>({
  key: 'postStoryKeyState',
  default: '',
});
