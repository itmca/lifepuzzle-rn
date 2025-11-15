export interface FacebookPhotoDto {
  imageUrl: string;
}

export interface FacebookPhotosResponse {
  photos: FacebookPhotoDto[];
}

export interface FacebookPhotoItem {
  id: string;
  imageUrl: string;
  selected: boolean;
}
