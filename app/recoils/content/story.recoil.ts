import {atom} from 'recoil';
import {PlayInfo, WritingStoryType} from '../../types/writing-story.type';

// 조회용 Story 선택 상태
export const selectedStoryKeyState = atom<string>({
  key: 'selectedStoryKeyState',
  default: '',
});

// 편집용 Story 상태
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
