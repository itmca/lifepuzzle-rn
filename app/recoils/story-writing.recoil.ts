import {atom, selector} from 'recoil';
import {
  VoiceRecordInfo,
  WritingStoryQuestionInfo,
  WritingStoryTextInfo,
  WritingStoryType,
} from '../types/writing-story.type';
import {selectedPhotoState, selectedVideoState} from './selected-photo.recoil';
import {heroState} from './hero.recoil';

export const helpQuestionState = atom<WritingStoryQuestionInfo | undefined>({
  key: 'helpQuestionState',
  default: undefined,
});

export const storyTextState = atom<WritingStoryTextInfo | undefined>({
  key: 'storyTextState',
  default: undefined,
});

export const storyDateState = atom<Date | undefined>({
  key: 'storyDateState',
  default: undefined,
});

export const recordFileState = atom<VoiceRecordInfo | undefined>({
  key: 'recordFileState',
  default: undefined,
});

export const writingStoryState = selector<WritingStoryType | undefined>({
  key: 'writingStoryState',
  get: ({get}) => {
    const hero = get(heroState);
    const questionInfo = get(helpQuestionState);
    const textInfo = get(storyTextState);
    const date = get(storyDateState);
    const photos = get(selectedPhotoState);
    const videos = get(selectedVideoState);
    const recordFile = get(recordFileState);

    return {
      heroNo: hero.heroNo,
      ...questionInfo,
      ...textInfo,
      date,
      photos,
      videos,
      voice: recordFile?.filePath,
    };
  },
});

export const isStoryUploading = atom<boolean>({
  key: 'isStoryUploading',
  default: false,
});
