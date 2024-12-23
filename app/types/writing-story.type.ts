import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';

export type WritingStoryType = {
  title?: string;
  content?: string;
  date?: Date;
  galleryIds?: number[];
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
  node: Pick<PhotoIdentifier['node'], 'image' | 'type'>;
};
