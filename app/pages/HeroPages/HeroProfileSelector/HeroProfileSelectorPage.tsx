import React, { useEffect, useState } from 'react';
import { PhotoIdentifier } from '@react-native-camera-roll/camera-roll';

import { useNavigation } from '@react-navigation/native';

import { logger } from '../../../utils/logger.util';
import { CommonPhotoSelector } from '../../../components/feature/photo/CommonPhotoSelector';
import {
  PhotoSelectorCallbacks,
  PhotoSelectorConfig,
  PhotoSelectorState,
} from '../../../types/ui/photo-selector.type';
import { FacebookPhotoItem } from '../../../types/external/facebook.type';
import { BasicNavigationProps } from '../../../navigation/types.tsx';

const HeroProfileSelectorPage = (): React.ReactElement => {
  // 외부 hook 호출 (navigation, route 등)
  const navigation = useNavigation<BasicNavigationProps>();

  // 로컬 상태 관리
  const [selectedPhoto, setSelectedPhoto] = useState<
    PhotoIdentifier | undefined
  >(undefined);

  // Sync selected photo to navigation params for header actions
  useEffect(() => {
    navigation.setParams?.({ selectedHeroPhoto: selectedPhoto });
  }, [navigation, selectedPhoto]);

  const config: PhotoSelectorConfig = {
    mode: 'single',
    source: 'device',
    initialPhotos: 20,
    loadMoreCount: 20,
    assetType: 'Photos',
  };

  const callbacks: PhotoSelectorCallbacks = {
    onPhotoSelect: (photo: PhotoIdentifier | FacebookPhotoItem) => {
      if ('node' in photo) {
        setSelectedPhoto(photo as PhotoIdentifier);
      } else {
        logger.warn('FacebookPhotoItem not supported in hero profile selector');
      }
    },
    onPhotoDeselect: () => {
      setSelectedPhoto(undefined);
    },
    onPermissionDenied: () => {
      navigation.goBack();
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

export { HeroProfileSelectorPage };
