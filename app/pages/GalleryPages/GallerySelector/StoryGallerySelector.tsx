import React, { useCallback, useEffect, useRef } from 'react';
import { PhotoIdentifier } from '@react-native-camera-roll/camera-roll';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native';
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
import { useTagSelection } from '../../../hooks/useTagSelection';

const StoryGallerySelector = (): React.ReactElement => {
  // Refs
  const tagScrollRef = useRef<ScrollView>(null);
  const tagOffsetsRef = useRef<number[]>([]);
  const layoutCompletedRef = useRef<boolean>(false);

  const navigation = useNavigation<BasicNavigationProps>();
  const { tags } = useMediaStore();
  const tagList = tags ?? [];
  const { selectedGalleryItems, setSelectedGalleryItems } = useSelectionStore();
  const isGalleryUploading = useUIStore(state => state.uploadState.gallery);

  // Custom hooks
  const { selectedTag, handleTagPress: handleTagPressBase } = useTagSelection({
    tags: tagList,
  });

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

  // Handlers
  const handleTagPress = useCallback(
    (index: number) => {
      handleTagPressBase(index);

      // Scroll tag ScrollView to selected tag
      if (tagScrollRef.current && tagOffsetsRef.current.length > 0) {
        const offset = tagOffsetsRef.current[index];
        if (offset !== undefined) {
          tagScrollRef.current.scrollTo({
            x: offset,
            animated: true,
          });
        }
      }
    },
    [handleTagPressBase],
  );

  const handleTagLayout = useCallback(
    (index: number, event: any) => {
      const { x } = event.nativeEvent.layout;
      tagOffsetsRef.current[index] = x;

      // Check if all layouts are complete
      if (
        !layoutCompletedRef.current &&
        tagOffsetsRef.current.length === tagList.length &&
        tagOffsetsRef.current.every(offset => offset !== undefined)
      ) {
        layoutCompletedRef.current = true;

        // Scroll to selected tag after layout is complete
        if (selectedTag?.key) {
          const selectedIndex = tagList.findIndex(
            item => item.key === selectedTag.key,
          );
          if (selectedIndex !== -1 && tagScrollRef.current) {
            setTimeout(() => {
              const offset = tagOffsetsRef.current[selectedIndex];
              if (offset !== undefined) {
                tagScrollRef.current?.scrollTo({
                  x: offset,
                  animated: false,
                });
              }
            }, 100);
          }
        }
      }
    },
    [tagList, selectedTag],
  );

  // Clear selection on mount
  useEffect(() => {
    setSelectedGalleryItems([]);
  }, [setSelectedGalleryItems]);

  // Auto-scroll to selected tag
  useEffect(() => {
    if (!selectedTag?.key || !tagList?.length) {
      return;
    }

    const index = tagList.findIndex(item => item.key === selectedTag.key);
    if (index === -1) {
      return;
    }

    // Scroll tag ScrollView to selected tag
    if (tagScrollRef.current && tagOffsetsRef.current.length > 0) {
      const offset = tagOffsetsRef.current[index];
      if (offset !== undefined) {
        tagScrollRef.current.scrollTo({
          x: offset,
          animated: true,
        });
      }
    }
  }, [selectedTag?.key, tagList]);

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
              ref={tagScrollRef}
              useHorizontalLayout
              gap={8}
              paddingRight={12}
              withNoBackground
            >
              {tagList.map((item, index) => (
                <GalleryTag
                  key={item.key || index}
                  item={item}
                  index={index}
                  selectedTag={selectedTag}
                  onPress={handleTagPress}
                  onLayout={event => handleTagLayout(index, event)}
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
