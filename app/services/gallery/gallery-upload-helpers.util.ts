import { PhotoIdentifier } from '@react-native-camera-roll/camera-roll';
import { UploadItem, UploadProgress } from './gallery-upload-types';

/**
 * PhotoIdentifier 배열로부터 초기 업로드 아이템 생성
 */
export const createInitialUploadItems = (
  items: PhotoIdentifier[],
): UploadItem[] =>
  items.map(item => ({
    originalImage: item,
    uploadStatus: 'pending' as const,
  }));

/**
 * 업로드 아이템 배열로부터 진행 상태 계산
 */
export const calculateProgress = (items: UploadItem[]): UploadProgress => ({
  total: items.length,
  completed: items.filter(item => item.uploadStatus === 'completed').length,
  converting: items.filter(item => item.uploadStatus === 'converting').length,
  uploading: items.filter(item => item.uploadStatus === 'uploading').length,
  failed: items.filter(item => item.uploadStatus === 'failed').length,
});

/**
 * 변환 완료된 아이템들 필터링
 */
export const getSuccessfulItems = (items: UploadItem[]): UploadItem[] =>
  items.filter(
    item =>
      item.uploadStatus === 'pending' && item.convertedUri && item.fileName,
  );

/**
 * 업로드 준비가 완료된 아이템들 필터링
 */
export const getReadyForUploadItems = (items: UploadItem[]): UploadItem[] =>
  items.filter(
    item =>
      item.convertedUri &&
      item.presignedUrl &&
      item.uploadHeaders &&
      item.fileKey,
  );
