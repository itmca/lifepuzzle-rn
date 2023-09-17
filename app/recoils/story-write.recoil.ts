import {atom, selector} from 'recoil';
import {
  VoiceRecordInfo,
  WritingStoryQuestionInfo,
  WritingStoryTextInfo,
  WritingStoryType,
} from '../types/writing-story.type';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';

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

export const selectedPhotoState = atom<PhotoIdentifier[]>({
  key: 'selectedPhotoState',
  default: [],
});
export const selectedVideoState = atom<PhotoIdentifier[]>({
  key: 'selectedVideoState',
  default: [],
});
export const writingStoryState = selector<WritingStoryType | undefined>({
  key: 'writingStoryState',
  get: ({get}) => {
    const questionInfo = get(helpQuestionState);
    const textInfo = get(storyTextState);
    const date = get(storyDateState);
    const photos = get(selectedPhotoState);
    const videos = get(selectedVideoState);
    const recordFile = get(recordFileState);

    return {
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

export const isModalOpening = atom<boolean>({
  key: 'isModalOpening',
  default: false,
});
export const helpQuestionTextState = atom<string>({
  key: 'helpQuestionText',
  default: '',
});
