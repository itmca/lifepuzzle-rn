import React from 'react';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';

import CommonPhotoSelector from '../../../components/feature/photo/CommonPhotoSelector';
import {useSelectionStore} from '../../../stores/selection.store';
import {
  PhotoSelectorCallbacks,
  PhotoSelectorConfig,
} from '../../../types/ui/photo-selector.type';

const AccountProfileSelectorPage = (): JSX.Element => {
  const {selectedUserPhoto, setSelectedUserPhoto} = useSelectionStore();
  const selectedPhoto = selectedUserPhoto;
  const setSelectedPhoto = setSelectedUserPhoto;

  const config: PhotoSelectorConfig = {
    mode: 'single',
    source: 'device',
    initialPhotos: 20,
    assetType: 'Photos',
  };

  const callbacks: PhotoSelectorCallbacks = {
    onPhotoSelect: (photo: PhotoIdentifier) => {
      setSelectedPhoto(photo as PhotoIdentifier);
    },
    onPhotoDeselect: () => {
      setSelectedPhoto(undefined);
    },
  };

  const state = {
    selectedPhotos: selectedPhoto ? [selectedPhoto] : [],
    setSelectedPhotos: (photos: PhotoIdentifier[]) => {
      setSelectedPhoto(photos[0] || undefined);
    },
  };

  return (
    <CommonPhotoSelector config={config} callbacks={callbacks} state={state} />
  );
};

export default AccountProfileSelectorPage;
