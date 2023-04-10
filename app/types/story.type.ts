export type StoryType = {
  id: string;
  heroNo: number;
  title: string;
  content: string;
  photos: string[];
  audios: string[];
  tags: StoryTag[];
  date: Date;
  createdAt: Date;
};

export type StoryTag = {
  key: string;
  displayName: string;
  priority: number;
};
