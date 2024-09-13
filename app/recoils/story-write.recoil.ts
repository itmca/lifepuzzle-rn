import {atom, DefaultValue, selector} from 'recoil';
import {PlayInfo, WritingStoryType} from '../types/writing-story.type';

export const writingRecordTimeState = atom<string>({
  key: 'recentRecordedDurationState',
  default: '',
});

const writingStoryInternalState = atom<WritingStoryType>({
  key: 'writingStoryInternalState',
  default: {},
});
export const playInfoInternalState = atom<PlayInfo>({
  key: 'playInfoInternalState',
  default: {},
});

export const writingStoryState = selector<WritingStoryType>({
  key: 'writingStoryState',
  get: ({get}) => get(writingStoryInternalState),
  set: ({get, set, reset}, newValue) => {
    if (newValue instanceof DefaultValue) {
      reset(writingStoryInternalState);
    } else {
      const currentWritingStory = get(writingStoryInternalState);
      set(writingStoryInternalState, {
        ...currentWritingStory,
        ...newValue,
      });
    }
  },
});
export const playInfoState = selector<PlayInfo>({
  key: 'playInfoState',
  get: ({get}) => get(playInfoInternalState),
  set: ({get, set, reset}, newValue) => {
    if (newValue instanceof DefaultValue) {
      reset(playInfoInternalState);
    } else {
      const currentPlayInfo = get(playInfoInternalState);
      set(playInfoInternalState, {
        ...currentPlayInfo,
        ...newValue,
      });
    }
  },
});
export const isStoryUploading = atom<boolean>({
  key: 'isStoryUploading',
  default: false,
});

export const isVoiceToTextProcessing = atom<boolean>({
  key: 'isVoiceToTextProcessing',
  default: false,
});

export const isModalOpening = atom<boolean>({
  key: 'isModalOpening',
  default: false,
});

export const PostStoryKeyState = atom<string>({
  key: 'PostStoryKeyState',
  default: '',
});
