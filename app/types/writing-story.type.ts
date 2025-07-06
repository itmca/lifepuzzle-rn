import {AgeType} from './photo.type.ts';

export type WritingStoryType = {
  title?: string;
  content?: string;
  date?: Date;
  gallery?: GalleryItem[];
  voice?: string;
};

export type GalleryItem = {
  id: number;
  uri: string;
  tagKey: AgeType;
};

export type PlayInfo = {
  isOpen?: boolean;
  isPlay?: boolean;
  currentPositionSec?: number;
  currentDurationSec?: number;
  playTime?: string;
  duration?: string;
};
