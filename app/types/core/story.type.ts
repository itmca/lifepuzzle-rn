export type StoryType = {
  id: string;
  heroId: number;
  content: string;
  question: string;
  photos: string[];
  audios: string[];
  audioDuration?: number;
  videos: string[];
  gallery: string[];
  tags: StoryTag[];
  date: Date;
  createdAt: Date;
  recordingTime?: string;
  playingTime?: string;
};

export type StoryTag = {
  key: string;
  displayName: string;
  priority: number;
};
