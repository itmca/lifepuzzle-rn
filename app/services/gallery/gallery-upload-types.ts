import { PhotoIdentifier } from '@react-native-camera-roll/camera-roll';
import { TagType } from '../../types/core/media.type.ts';

/**
 * 업로드 아이템 상태
 */
export interface UploadItem {
  originalImage: PhotoIdentifier;
  convertedUri?: string;
  fileName?: string;
  fileKey?: string;
  presignedUrl?: string;
  uploadHeaders?: Record<string, string>;
  uploadStatus: 'pending' | 'converting' | 'uploading' | 'completed' | 'failed';
  error?: string;
}

/**
 * 업로드 진행 상태
 */
export interface UploadProgress {
  total: number;
  completed: number;
  converting: number;
  uploading: number;
  failed: number;
}

/**
 * 업로드 요청 옵션
 */
export type UploadRequest = {
  heroNo?: number;
  selectedTag?: TagType;
  selectedGalleryItems?: PhotoIdentifier[];
};

/**
 * useUploadGalleryV2 옵션
 */
export interface UseUploadGalleryV2Options {
  request?: UploadRequest;
  onClose?: () => void;
}

/**
 * 상수
 */
export const CONCURRENT_UPLOADS = 3;

export const IMAGE_CONVERSION_OPTIONS = {
  quality: 80,
  maxWidth: 1920,
  maxHeight: 1080,
  format: 'JPEG' as const,
};
