export type AiPhotoTemplate = {
  id: number;
  name: string;
  url: string;
  thumbnailUrl: string;
  description?: string;
};

export type AiType = 'AI_PHOTO';

export type AiGallery = {
  id: number;
  status: 'IN_PROGRESS' | 'COMPLETED';
  createdBy?: string;
  requestedAt: string;
  completedAt: string;
  thumbnailUrl?: string;
  videoUrl?: string;
};
