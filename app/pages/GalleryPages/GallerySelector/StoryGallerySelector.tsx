import React, { useEffect, useMemo, useRef } from 'react';
import { PhotoIdentifier } from '@react-native-camera-roll/camera-roll';
import { useNavigation } from '@react-navigation/native';
import { ICarouselInstance } from 'react-native-reanimated-carousel';
import { BasicNavigationProps } from '../../../navigation/types';
import { FacebookPhotoItem } from '../../../types/external/facebook.type';

import CommonPhotoSelector from '../../../components/feature/photo/CommonPhotoSelector.tsx';
import { useSelectionStore } from '../../../stores/selection.store';
import {
  PhotoSelectorCallbacks,
  PhotoSelectorConfig,
} from '../../../types/ui/photo-selector.type';
import { LoadingContainer } from '../../../components/ui/feedback/LoadingContainer';
import { useUIStore } from '../../../stores/ui.store';
import { useMediaStore } from '../../../stores/media.store';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../../components/ui/layout/ContentContainer.tsx';
import GalleryTag from '../../Home/components/gallery/GalleryTag.tsx';

const StoryGallerySelector = (): React.ReactElement => {
  const navigation = useNavigation<BasicNavigationProps>();
  const { tags } = useMediaStore();
  const tagList = useMemo(() => tags ?? [], [tags]);
  const {
    selectedGalleryItems,
    selectedTag,
    setSelectedGalleryItems,
    setSelectedTag,
  } = useSelectionStore();
  const isGalleryUploading = useUIStore(state => state.uploadState.gallery);
  const tagCarouselRef = useRef<ICarouselInstance | null>(null);

  const config: PhotoSelectorConfig = {
    mode: 'multiple',
    source: 'device',
    initialPhotos: 20,
    loadMoreCount: 50,
    assetType: 'All',
    showOrderNumbers: true,
    showCropButton: false,
  };

  const callbacks: PhotoSelectorCallbacks = {
    onMultipleSelect: (photos: (PhotoIdentifier | FacebookPhotoItem)[]) => {
      setSelectedGalleryItems(
        photos.filter(photo => 'node' in photo) as PhotoIdentifier[],
      );
    },
    onPermissionDenied: () => {
      navigation.goBack();
    },
  };

  // Clear selection on mount
  useEffect(() => {
    setSelectedGalleryItems([]);
  }, [setSelectedGalleryItems]);

  // Keep home-selected tag as default, but ensure a tag is selected
  useEffect(() => {
    const isSelectedTagValid = tagList.some(
      tag => tag.key === selectedTag?.key,
    );

    if (!isSelectedTagValid && tagList.length > 0) {
      setSelectedTag({ ...tagList[0] });
    }
  }, [selectedTag, setSelectedTag, tagList]);

  const state = {
    selectedPhotos: selectedGalleryItems,
    setSelectedPhotos: setSelectedGalleryItems,
  };

  return (
    <LoadingContainer isLoading={isGalleryUploading}>
      <ContentContainer flex={1} gap={12}>
        {tagList.length > 0 && (
          <ContentContainer paddingHorizontal={10} paddingTop={4}>
            <ScrollContentContainer
              useHorizontalLayout
              gap={8}
              paddingRight={12}
              withNoBackground
            >
              {tagList.map((item, index) => (
                <GalleryTag
                  key={item.key || index}
                  carouselRef={tagCarouselRef}
                  item={item}
                  index={index}
                  showCount={false}
                  compact
                />
              ))}
            </ScrollContentContainer>
          </ContentContainer>
        )}
        <ContentContainer flex={1}>
          <CommonPhotoSelector
            config={{
              ...config,
              showConfirmButton: false,
            }}
            callbacks={callbacks}
            state={state}
          />
        </ContentContainer>
      </ContentContainer>
    </LoadingContainer>
  );
};

export default StoryGallerySelector;
