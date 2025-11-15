import React from 'react';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {useRecoilState} from 'recoil';

import CommonPhotoSelector from '../../../components/feature/photo/CommonPhotoSelector';
import {selectedUserPhotoState} from '../../../recoils/ui/selection.recoil';
import {
  PhotoSelectorCallbacks,
  PhotoSelectorConfig,
} from '../../../types/photo-selector.type';

const AccountProfileSelectorPage = (): JSX.Element => {
  const [selectedPhoto, setSelectedPhoto] = useRecoilState(
    selectedUserPhotoState,
  );

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
