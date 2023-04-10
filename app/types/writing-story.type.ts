import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';

export type WritingStoryType = {
  heroNo?: number;
  recQuestionNo?: number;
  recQuestionModified?: boolean;
  helpQuestionText?: string;
  title?: string;
  storyText?: string;
  date?: Date;
  photos?: PhotoIdentifier[];
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

export type VoiceRecordInfo = {
  filePath: string | undefined;
  recordTime: string | undefined;
};
