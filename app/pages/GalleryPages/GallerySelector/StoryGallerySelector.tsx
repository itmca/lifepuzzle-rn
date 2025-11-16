import React from 'react';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {useNavigation} from '@react-navigation/native';

import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import CommonPhotoSelector from '../../../components/feature/photo/CommonPhotoSelector.tsx';
import {selectionState} from '../../../recoils/ui/selection.recoil';
import {
  PhotoSelectorCallbacks,
  PhotoSelectorConfig,
} from '../../../types/ui/photo-selector.type';
import {LoadingContainer} from '../../../components/ui/feedback/LoadingContainer';
import {Color} from '../../../constants/color.constant.ts';
import {uploadState} from '../../../recoils/ui/upload.recoil.ts';

const StoryGallerySelector = (): JSX.Element => {
  const navigation = useNavigation();
  const [selection, setSelection] = useRecoilState(selectionState);
  const uploadStateValue = useRecoilValue(uploadState);

  const galleryIndex = selection.currentGalleryIndex;
  const selectedGalleryItems = selection.gallery;
  const editGalleryItems = selection.editedGallery;
  const isGalleryUploading = uploadStateValue.gallery;

  const setGalleryIndex = (index: number) =>
    setSelection(prev => ({...prev, currentGalleryIndex: index}));
  const setSelectedGalleryItems = (items: PhotoIdentifier[]) =>
    setSelection(prev => ({...prev, gallery: items}));
  const setEditGalleryItems = (items: PhotoIdentifier[]) =>
    setSelection(prev => ({...prev, editedGallery: items}));

  const config: PhotoSelectorConfig = {
    mode: 'multiple',
    source: 'device',
    initialPhotos: 20,
    loadMoreCount: 50,
    assetType: 'All',
    showOrderNumbers: true,
    showCropButton: true,
  };

  const callbacks: PhotoSelectorCallbacks = {
    onMultipleSelect: (photos: PhotoIdentifier[]) => {
      setSelectedGalleryItems(photos as PhotoIdentifier[]);
    },
    onPermissionDenied: () => {
      navigation.goBack();
    },
  };

  const handleNavigateToGalleryDetail = () => {
    setGalleryIndex(0);
    setEditGalleryItems([...selectedGalleryItems]);
    navigation.push('NoTab', {
      screen: 'StoryWritingNavigator',
      params: {
        screen: 'GalleryDetail',
      },
    });
  };

  // Clear selection on mount
  React.useEffect(() => {
    setSelectedGalleryItems([]);
  }, []);

  const state = {
    selectedPhotos: selectedGalleryItems,
    setSelectedPhotos: setSelectedGalleryItems,
  };

  return (
    <LoadingContainer isLoading={isGalleryUploading}>
      <CommonPhotoSelector
        config={{
          ...config,
          showConfirmButton: false, // We use custom navigation instead
        }}
        callbacks={callbacks}
        state={state}
      />

      {/* Custom navigation button */}
      {selectedGalleryItems.length > 0 && (
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: Color.MAIN_DARK,
            borderRadius: 50,
            width: 50,
            height: 50,
            position: 'absolute',
            bottom: 25,
            right: 25,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Color.WHITE,
          }}
          onPress={handleNavigateToGalleryDetail}>
          <Icon name="magic" size={25} color={Color.MAIN_DARK} />
        </TouchableOpacity>
      )}
    </LoadingContainer>
  );
};

export default StoryGallerySelector;
