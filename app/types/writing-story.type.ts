export type WritingStoryType = {
  heroNo?: number;
  recQuestionNo?: number;
  recQuestionModified?: boolean;
  helpQuestionText?: string;
  title?: string;
  storyText?: string;
  date?: Date;
  photos?: MediaInfo[];
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
  mediaType: 'photo' | 'video';
  filename: string | null;
  filepath: string;
  extension: string | null;
  uri: string;
  height: number;
  width: number;
  fileSize: number | null;
  playableDuration: number;
  orientation: number | null;
};
export type VoiceRecordInfo = {
  filePath: string | undefined;
  recordTime: string | undefined;
};
