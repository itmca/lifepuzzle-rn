import axios from 'axios';

export interface FileUploadDto {
  fileName: string;
  contentType: string;
}

export interface PresignedUrlRequest {
  heroId: number;
  ageGroup: string;
  files: FileUploadDto[];
}

export interface PresignedUrlDto {
  fileKey: string;
  url: string;
  headers: Record<string, string>;
}

export interface PresignedUrlResponse {
  presignedUrls: PresignedUrlDto[];
}

export interface GalleryUploadCompleteRequest {
  fileKeys: string[];
}

const convertCamelCaseHeaders = (
  headers: Record<string, string>,
): Record<string, string> => {
  const httpHeaders: Record<string, string> = {};

  Object.entries(headers).forEach(([key, value]) => {
    switch (key) {
      case 'contentType':
        httpHeaders['Content-Type'] = value;
        break;
      case 'cacheControl':
        httpHeaders['Cache-Control'] = value;
        break;
      case 'host':
        httpHeaders.Host = value;
        break;
      default:
        const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        httpHeaders[kebabKey] = value;
        break;
    }
  });

  return httpHeaders;
};

export const galleryApiService = {
  async uploadToPresignedUrl(
    url: string,
    data: ArrayBuffer | Uint8Array,
    headers: Record<string, string>,
  ): Promise<void> {
    await axios.put(url, data, {
      headers: convertCamelCaseHeaders(headers),
      transformRequest: [data => data],
    });
  },
};
