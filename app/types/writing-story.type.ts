import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';

export type WritingStoryType = {
  heroNo?: number;
  recQuestionNo?: number;
  recQuestionModified?: boolean;
  helpQuestionText?: string;
  title?: string;
  storyText?: string;
  date?: Date;
  photos?: MediaInfo[];
  videos?: MediaInfo[];
  voice?: string;
};

export type WritingStoryQuestionInfo = Pick<
  WritingStoryType,
  'recQuestionNo' | 'recQuestionModified' | 'helpQuestionText'
>;

export type WritingStoryTextInfo = Pick<
  WritingStoryType,
  'title' | 'storyText'
>;
export type MediaInfo = {
  key: number;
  node: Pick<PhotoIdentifier['node'], 'image'>;
};
export type VoiceRecordInfo = {
  filePath: string | undefined;
  recordTime: string | undefined;
};
