import React from 'react';
import { PhotoIdentifier } from '@react-native-camera-roll/camera-roll';

import { useNavigation } from '@react-navigation/native';

import CommonPhotoSelector from '../../../components/feature/photo/CommonPhotoSelector';
import { useSelectionStore } from '../../../stores/selection.store';
import {
  PhotoSelectorCallbacks,
  PhotoSelectorConfig,
} from '../../../types/ui/photo-selector.type';

const HeroProfileSelectorPage = (): JSX.Element => {
  // 글로벌 상태 관리
  const { selectedHeroPhoto, setSelectedHeroPhoto } = useSelectionStore();

  // 외부 hook 호출 (navigation, route 등)
  const navigation = useNavigation();

  // Derived value or local variables
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
