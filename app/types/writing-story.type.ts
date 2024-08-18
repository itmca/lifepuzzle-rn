import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';

export type WritingStoryType = {
  recQuestionNo?: number;
  helpQuestionText?: string;
  title?: string;
  storyText?: string;
  date?: Date;
  photos?: MediaInfo[];
  videos?: MediaInfo[];
  voice?: string;
};
export type PlayInfo = {
  isOpen?: boolean;
  isPlay?: boolean;
  currentPositionSec?: number;
  currentDurationSec?: number;
  playTime?: string;
  duration?: string;
};
export type MediaInfo = {
  key?: number;
  node: Pick<PhotoIdentifier['node'], 'image'>;
};
