/**
 * 파일 경로 처리와 관련된 공통 유틸리티 함수들
 */

export const extractFileName = (uri: string): string | undefined => {
  if (!uri) return undefined;
  const fileParts = uri.split('/');
  return fileParts.length > 0 ? fileParts[fileParts.length - 1] : undefined;
};

export const generateTimestampedFileName = (
  originalName: string | undefined,
  prefix: string = 'file',
  extension: string = 'jpg',
): string => {
  const timestamp = Date.now();
  return originalName
    ? `${timestamp}_${originalName}`
    : `${prefix}_${timestamp}.${extension}`;
};

export const normalizeFileUri = (path: string): string => {
  if (!path) return '';
  return path.startsWith('file://') ? path : `file://${path}`;
};

export const generateImagePath = (
  uri: string | undefined,
  fallbackUrl?: string,
): string => {
  if (!uri) {
    return fallbackUrl ?? '';
  }

  const fileName = extractFileName(uri);
  return generateTimestampedFileName(fileName);
};
