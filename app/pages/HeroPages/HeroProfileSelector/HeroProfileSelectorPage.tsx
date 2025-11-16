import React from 'react';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';

import {useNavigation} from '@react-navigation/native';

import CommonPhotoSelector from '../../../components/feature/photo/CommonPhotoSelector';
import {useSelectionStore} from '../../../stores/selection.store';
import {
  PhotoSelectorCallbacks,
  PhotoSelectorConfig,
} from '../../../types/ui/photo-selector.type';

const HeroProfileSelectorPage = (): JSX.Element => {
  const navigation = useNavigation();
  const {selectedHeroPhoto, setSelectedHeroPhoto} = useSelectionStore();
  const selectedPhoto = selectedHeroPhoto;
  const setSelectedPhoto = setSelectedHeroPhoto;

  const config: PhotoSelectorConfig = {
    mode: 'single',
    source: 'device',
    initialPhotos: 20,
    loadMoreCount: 20,
    assetType: 'Photos',
  };

  const callbacks: PhotoSelectorCallbacks = {
    onPhotoSelect: (photo: PhotoIdentifier) => {
      setSelectedPhoto(photo as PhotoIdentifier);
    },
    onPhotoDeselect: () => {
      setSelectedPhoto(undefined);
    },
    onPermissionDenied: () => {
      navigation.goBack();
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

export default HeroProfileSelectorPage;
