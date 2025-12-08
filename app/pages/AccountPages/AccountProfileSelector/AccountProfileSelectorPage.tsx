import React from 'react';
import { PhotoIdentifier } from '@react-native-camera-roll/camera-roll';

import logger from '../../../utils/logger.util';
import CommonPhotoSelector from '../../../components/feature/photo/CommonPhotoSelector';
import { useSelectionStore } from '../../../stores/selection.store';
import {
  PhotoSelectorCallbacks,
  PhotoSelectorConfig,
  PhotoSelectorState,
} from '../../../types/ui/photo-selector.type';
import { FacebookPhotoItem } from '../../../types/external/facebook.type';

const AccountProfileSelectorPage = (): React.ReactElement => {
  // 글로벌 상태 관리
  const { selectedUserPhoto, setSelectedUserPhoto } = useSelectionStore();

  // Derived value or local variables
  const selectedPhoto = selectedUserPhoto;
  const setSelectedPhoto = setSelectedUserPhoto;

  const config: PhotoSelectorConfig = {
    mode: 'single',
    source: 'device',
    initialPhotos: 20,
    assetType: 'Photos',
  };

  const callbacks: PhotoSelectorCallbacks = {
    onPhotoSelect: (photo: PhotoIdentifier | FacebookPhotoItem) => {
      if ('node' in photo) {
        // It's a PhotoIdentifier
        setSelectedPhoto(photo as PhotoIdentifier);
      } else {
        // It's a FacebookPhotoItem - convert or handle accordingly
        logger.warn(
          'FacebookPhotoItem not supported in account profile selector',
        );
      }
    },
    onPhotoDeselect: () => {
      setSelectedPhoto(undefined);
    },
  };

  const state: PhotoSelectorState = {
    selectedPhotos: selectedPhoto ? [selectedPhoto] : [],
    setSelectedPhotos: (photos: (PhotoIdentifier | FacebookPhotoItem)[]) => {
      const firstPhoto = photos[0];
      if (firstPhoto && 'node' in firstPhoto) {
        setSelectedPhoto(firstPhoto as PhotoIdentifier);
      } else {
        setSelectedPhoto(undefined);
      }
    },
  };

  return (
    <CommonPhotoSelector config={config} callbacks={callbacks} state={state} />
  );
};

export default AccountProfileSelectorPage;
