import { PhotoIdentifier } from '@react-native-camera-roll/camera-roll';
import { FacebookPhotoItem } from '../external/facebook.type';
import { AgeType } from '../core/media.type';
import { FilterType } from '../../constants/filter.constant';

export type PhotoSource = 'device' | 'custom';
export type SelectionMode = 'single' | 'multiple';

// Extended PhotoIdentifier with original URI for filter preservation
export type ExtendedPhotoIdentifier = PhotoIdentifier & {
  originalUri?: string;
  appliedFilter?: FilterType;
};

export interface PhotoSelectorConfig {
  mode: SelectionMode;
  source: PhotoSource;
  showCropButton?: boolean;
  showOrderNumbers?: boolean;
  showConfirmButton?: boolean;
  maxSelection?: number;
  initialPhotos?: number;
  loadMoreCount?: number;
  assetType?: 'Photos' | 'Videos' | 'All';
  // For custom source
  customPhotos?: (PhotoIdentifier | FacebookPhotoItem)[];
  onLoadMore?: () => void;
  hasMorePhotos?: boolean;
}

export interface PhotoSelectorCallbacks {
  onPhotoSelect?: (photo: PhotoIdentifier | FacebookPhotoItem) => void;
  onPhotoDeselect?: (photo: PhotoIdentifier | FacebookPhotoItem) => void;
  onMultipleSelect?: (photos: (PhotoIdentifier | FacebookPhotoItem)[]) => void;
  onConfirm?: (
    photos: (PhotoIdentifier | FacebookPhotoItem)[],
    ageGroup?: AgeType,
  ) => void;
  onCancel?: () => void;
  onPermissionDenied?: () => void;
  onError?: (error: string) => void;
}

export interface PhotoSelectorState {
  selectedPhotos: (PhotoIdentifier | FacebookPhotoItem)[];
  setSelectedPhotos: (photos: (PhotoIdentifier | FacebookPhotoItem)[]) => void;
}
