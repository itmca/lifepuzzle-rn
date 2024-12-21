type ValidDecades = 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90;
export type AgeType = 'under10' | `${ValidDecades}s`;
export type AgeGroupsType = {
  totalGallery: number;
} & Partial<Record<AgeType, AgeGroupType>>;
export type AgeGroupType = {
  startYear: number;
  endYear: number;
  galleryCount: number;
  gallery: GalleryType[];
};
export type GalleryType = {
  id: number;
  index: number;
  type: 'photo' | 'video';
  url: string;
  story?: StoryType;
  tag?: TagType;
};
export type TagType = {
  key: string;
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
  audio?: string;
  date: string;
};
