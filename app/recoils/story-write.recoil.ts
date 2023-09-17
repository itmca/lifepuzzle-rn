import {atom, DefaultValue, selector} from 'recoil';
import {WritingStoryType} from '../types/writing-story.type';

export const writingRecordTimeState = atom<string>({
  key: 'recentRecordedDurationState',
  default: '',
});

const writingStoryInternalState = atom<WritingStoryType>({
  key: 'writingStoryInternalState',
  default: undefined,
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
