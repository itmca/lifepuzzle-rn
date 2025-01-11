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
export type AgeGroupsType = Partial<Record<AgeType, AgeGroupType>>;
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
export type TagType = {
  key: AgeType;
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
export type StoryType = {
  id: number;
  title: string;
  content: string;
  audios?: string[];
  date: string;
};
