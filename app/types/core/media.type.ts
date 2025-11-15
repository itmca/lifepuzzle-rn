import {AiType} from '../external/ai-photo.type';
import {StoryType} from './story.type';

export type AgeType =
  | 'UNDER_TEENAGER'
  | 'TEENAGER'
  | 'TWENTIES'
  | 'THIRTY'
  | 'FORTY'
  | 'FIFTY'
  | 'SIXTY'
  | 'SEVENTY'
  | 'EIGHTY'
  | 'NINETY'
  | 'UPPER_NINETY';
export type AgeGroupsType = Partial<Record<TagKey, AgeGroupType>>;
export type AgeGroupType = {
  startYear: number;
  endYear: number;
  galleryCount: number;
  gallery: GalleryType[];
};
export type GalleryType = {
  id: number;
  index: number;
  type: 'IMAGE' | 'VIDEO';
  url: string;
  story?: StoryType;
  tag: TagType;
};
export type TagKey = AgeType | AiType;
export type TagType = {
  key: TagKey;
  label: string;
  count?: number;
};

export type PhotoHeroType = {
  id: number;
  name: string;
  nickname: string;
  birthdate: string;
  age: number;
  image: string;
};

export type SharePhoto = {
  type: string;
  uri: string;
  uriList: string[];
};
