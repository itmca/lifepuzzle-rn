import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useRecoilState, useRecoilValue} from 'recoil';

import CommonPhotoSelector from '../../../components/photo/CommonPhotoSelector';
import {
  isGalleryUploadingState,
  selectedGalleryItemsState,
} from '../../../recoils/gallery-write.recoil';
import {FacebookPhotoItem} from '../../../types/facebook.type';
import {AgeType} from '../../../types/photo.type';
import {
  PhotoSelectorConfig,
  PhotoSelectorCallbacks,
} from '../../../types/photo-selector.type';
import {toPhotoIdentifierFromFacebookPhoto} from '../../../service/photo-identifier.service';

const FacebookPhotoSelector = (): JSX.Element => {
  const navigation = useNavigation();
  const [selectedGalleryItems, setSelectedGalleryItems] = useRecoilState(
    selectedGalleryItemsState,
  );
  const isGalleryUploading = useRecoilValue(isGalleryUploadingState);

  const config: PhotoSelectorConfig = {
    mode: 'multiple',
    source: 'facebook',
    showAgeSelector: true,
    showOrderNumbers: true,
    showConfirmButton: true,
  };

  const callbacks: PhotoSelectorCallbacks = {
    onConfirm: (photos: FacebookPhotoItem[], ageGroup: AgeType) => {
      if (!ageGroup) {
        return;
      }

      // Facebook 사진을 PhotoIdentifier 형태로 변환
      const photoIdentifiers = photos.map(photo =>
        toPhotoIdentifierFromFacebookPhoto(
          photo as FacebookPhotoItem,
          ageGroup,
        ),
      );

      // 선택된 사진들을 갤러리 아이템에 추가
      setSelectedGalleryItems([...selectedGalleryItems, ...photoIdentifiers]);

      navigation.goBack();
    },
    onCancel: () => {
      navigation.goBack();
    },
    onError: (error: string) => {
      navigation.goBack();
    },
  };

  return <CommonPhotoSelector config={config} callbacks={callbacks} />;
};

export default FacebookPhotoSelector;
