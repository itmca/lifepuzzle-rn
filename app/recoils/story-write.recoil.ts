import {atom, DefaultValue, selector} from 'recoil';
import {PlayingInfo, WritingStoryType} from '../types/writing-story.type';

export const writingRecordTimeState = atom<string>({
  key: 'recentRecordedDurationState',
  default: '',
});

const writingStoryInternalState = atom<WritingStoryType>({
  key: 'writingStoryInternalState',
  default: {},
});
export const playingRecordInfoState = atom<PlayingInfo>({
  key: 'playingRecordInfoState',
  default: {
    currentPositionSec: 0,
    currentDurationSec: 0,
    playTime: '00:00:00',
    duration: '00:00:00',
  },
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

export const isStoryUploading = atom<boolean>({
  key: 'isStoryUploading',
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
