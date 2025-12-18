import { TagKey } from './media.type';

export type WritingStoryType = {
  content?: string;
  date?: Date;
  gallery?: GalleryItem[];
  voice?: string;
};

export type GalleryItem = {
  id: number;
  uri: string;
  tagKey: TagKey;
  width?: number;
  height?: number;
};

export type PlayInfo = {
  isOpen?: boolean;
  isPlay?: boolean;
  currentPositionSec?: number;
  currentDurationSec?: number;
  playTime?: string;
  duration?: string;
};
