import React from 'react';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {useNavigation} from '@react-navigation/native';

import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import CommonPhotoSelector from '../../../components/feature/photo/CommonPhotoSelector.tsx';
import {useSelectionStore} from '../../../stores/selection.store';
import {
  PhotoSelectorCallbacks,
  PhotoSelectorConfig,
} from '../../../types/ui/photo-selector.type';
import {LoadingContainer} from '../../../components/ui/feedback/LoadingContainer';
import {Color} from '../../../constants/color.constant.ts';
import {useUIStore} from '../../../stores/ui.store';

const StoryGallerySelector = (): JSX.Element => {
  const navigation = useNavigation();
  const {
    currentGalleryIndex: galleryIndex,
    selectedGalleryItems,
    editGalleryItems,
    setCurrentGalleryIndex: setGalleryIndex,
    setSelectedGalleryItems,
    setEditGalleryItems,
  } = useSelectionStore();
  const isGalleryUploading = useUIStore(state => state.uploadState.gallery);

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
