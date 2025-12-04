import React, { useCallback, useMemo, useState } from 'react';
import { Image, Platform } from 'react-native';

import { LoadingContainer } from '../../../components/ui/feedback/LoadingContainer';
import { ScreenContainer } from '../../../components/ui/layout/ScreenContainer';
import { PhotoEditorMediaCarousel } from './components/PhotoEditorMediaCarousel';
import { EditorActionButton } from './components/EditorActionButton';
import MediaCarouselPagination from '../../../components/feature/story/MediaCarouselPagination';
import { useNavigation } from '@react-navigation/native';
import { ContentContainer } from '../../../components/ui/layout/ContentContainer.tsx';

import { Color } from '../../../constants/color.constant.ts';
import {
  CAROUSEL_WIDTH_PADDED,
  MAX_PHOTO_EDITOR_CAROUSEL_HEIGHT,
} from '../../../constants/carousel.constant.ts';
import { FilterType } from '../../../constants/filter.constant.ts';
import { BasicNavigationProps } from '../../../navigation/types.tsx';
import { useSelectionStore } from '../../../stores/selection.store';
import { useUIStore } from '../../../stores/ui.store';
import ImagePicker from 'react-native-image-crop-picker';
import { CustomAlert } from '../../../components/ui/feedback/CustomAlert';
import { PhotoFilterBottomSheet } from './components/PhotoFilterBottomSheet';
import { useImageDimensions } from '../../../hooks/useImageDimensions';
import { calculateOptimalCarouselHeight } from '../../../utils/carousel-dimension.util';
import logger from '../../../utils/logger';

const PhotoEditorPage = (): React.ReactElement => {
  // React hooks
  const [contentContainerHeight, setContentContainerHeight] = useState(0);
  const [filterBottomSheetOpen, setFilterBottomSheetOpen] = useState(false);

  // 글로벌 상태 관리 (Zustand)
  const {
    editGalleryItems,
    setEditGalleryItems,
    currentGalleryIndex: galleryIndex,
    setCurrentGalleryIndex: setGalleryIndex,
  } = useSelectionStore();
  const isGalleryUploading = useUIStore(state => state.uploadState.gallery);

  // 외부 hook 호출 (navigation, route 등)
  const navigation = useNavigation<BasicNavigationProps>();

  // Custom hooks
  const imageSources = useMemo(
    () =>
      editGalleryItems.map(item => ({
        uri: item.node.image.uri,
        width: item.node.image.width,
        height: item.node.image.height,
      })),
    [editGalleryItems],
  );
  const imageDimensions = useImageDimensions(imageSources, {
    defaultWidth: CAROUSEL_WIDTH_PADDED,
    defaultHeight: MAX_PHOTO_EDITOR_CAROUSEL_HEIGHT,
  });

  // Memoized values
  const currentItem = editGalleryItems[galleryIndex];
  const isCurrentItemVideo =
    currentItem?.node?.image?.playableDuration &&
    currentItem.node.image.playableDuration > 0;

  const onCrop = async () => {
    const image = editGalleryItems.find((e, idx) => idx === galleryIndex);

    if (image && image.node.image.uri) {
      let width = image.node.image.width;
      let height = image.node.image.height;

      if (!width || !height) {
        const size = await Image.getSize(image.node.image.uri);
        width = size.width;
        height = size.height;
      }
      try {
        logger.debug(
          'Image dimensions:',
          image.node.image.width,
          image.node.image.height,
        );

        const croppedImage = await ImagePicker.openCropper({
          mediaType: 'photo',
          path: image.node.image.uri, // Use the potentially downloaded path
          width: width,
          height: height,
          cropping: true,
          freeStyleCropEnabled: true,
          cropperToolbarTitle: '사진 편집',
          cropperCancelText: '취소', //ios
          cropperChooseText: '완료', //ios
          compressImageQuality: 1,
          cropperActiveWidgetColor: Color.MAIN, //android
          cropperToolbarWidgetColor: Color.BLACK, //android
        }).then(response => {
          const newImageObject = {
            ...image,
            node: {
              ...image.node, // 기존 node 속성들 복사
              image: {
                ...image.node.image, // 기존 node.image 속성들 복사
                uri: response.path, // uri만 새 경로로 업데이트
                width: response.width,
                height: response.height,
                size: response.size ?? image.node.image.fileSize,
                filename: response.filename ?? image.node.image.filename,
              },
            },
          };
          const updatedGallery = editGalleryItems.map((e, idx) => {
            if (idx === galleryIndex) {
              return newImageObject;
            } else {
              return e;
            }
          });
          setEditGalleryItems([...updatedGallery]);
        });
      } catch (cropError) {
        logger.debug('Image crop error:', image.node.image.uri, cropError);
        // 오류 처리 (예: 해당 이미지는 건너뛰기)
      }
    } else {
      CustomAlert.simpleAlert('크롭할 이미지가 선택되지 않았습니다.');
    }
  };
  const onFilter = () => {
    setFilterBottomSheetOpen(true);
  };

  const handleApplyFilter = useCallback(
    (filter: FilterType, filteredUri?: string) => {
      const currentItem = editGalleryItems[galleryIndex];
      if (!currentItem) {
        return;
      }

      // 원본 URI 보존 (처음 적용 시에만)
      const originalUri = currentItem.originalUri ?? currentItem.node.image.uri;

      // 원본 복원
      if (filter === 'original') {
        const restoredImageObject = {
          ...currentItem,
          originalUri,
          appliedFilter: 'original',
          node: {
            ...currentItem.node,
            image: {
              ...currentItem.node.image,
              uri: originalUri,
            },
          },
        };

        const updatedGallery = editGalleryItems.map((e, idx) =>
          idx === galleryIndex ? restoredImageObject : e,
        );
        setEditGalleryItems(updatedGallery);
        return;
      }

      if (!filteredUri) {
        logger.warn(
          '[PhotoEditor] Filter apply requested without filtered URI',
        );
        return;
      }

      const newImageObject = {
        ...currentItem,
        originalUri, // 원본 보존
        appliedFilter: filter,
        node: {
          ...currentItem.node,
          image: {
            ...currentItem.node.image,
            uri: filteredUri,
          },
        },
      };

      const updatedGallery = editGalleryItems.map((e, idx) =>
        idx === galleryIndex ? newImageObject : e,
      );
      setEditGalleryItems([...updatedGallery]);
    },
    [editGalleryItems, galleryIndex, setEditGalleryItems],
  );
  const onContentContainerLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    // logger.debug('ContentContainer Height:', height);
    setContentContainerHeight(height);
  };

  const handleScroll = useCallback(
    (index: number) => {
      logger.debug(
        'PhotoEditor onScroll called:',
        index,
        'current:',
        galleryIndex,
      );
      setGalleryIndex(index % editGalleryItems.length);
    },
    [editGalleryItems.length, setGalleryIndex, galleryIndex],
  );

  // 이미지 비율에 맞는 최적의 캐러셀 높이 계산
  const optimalCarouselHeight = useMemo(
    () =>
      calculateOptimalCarouselHeight(
        imageDimensions,
        CAROUSEL_WIDTH_PADDED,
        MAX_PHOTO_EDITOR_CAROUSEL_HEIGHT,
      ),
    [imageDimensions],
  );

  return (
    <LoadingContainer isLoading={isGalleryUploading}>
      <ScreenContainer edges={['left', 'right', 'bottom']}>
        <ContentContainer
          flex={1}
          alignItems="center"
          justifyContent="center"
          paddingVertical={10}
          onLayout={onContentContainerLayout}
        >
          <ContentContainer
            flex={1}
            alignItems="center"
            justifyContent="center"
            paddingTop={24}
          >
            <PhotoEditorMediaCarousel
              data={editGalleryItems.map((item, index) => ({
                type:
                  item.node.image.playableDuration &&
                  item.node.image.playableDuration > 0
                    ? 'VIDEO'
                    : 'IMAGE',
                url: item.node.image.uri,
                index: index,
                width: imageDimensions[index]?.width,
                height: imageDimensions[index]?.height,
              }))}
              activeIndex={galleryIndex}
              carouselWidth={CAROUSEL_WIDTH_PADDED}
              carouselMaxHeight={Math.min(
                Math.max(contentContainerHeight - 32, 0),
                optimalCarouselHeight,
              )}
              onScroll={handleScroll}
            />
          </ContentContainer>
          <ContentContainer
            alignItems="center"
            paddingBottom={Platform.OS === 'android' ? 56 : 40}
            gap={16}
          >
            {editGalleryItems.length > 1 && (
              <MediaCarouselPagination
                key={`pagination-${galleryIndex}`}
                visible={true}
                activeMediaIndexNo={galleryIndex}
                mediaCount={editGalleryItems.length}
                containerStyle={{ position: 'relative', top: 0, left: 0 }}
              />
            )}
            <ContentContainer
              useHorizontalLayout
              alignItems={'center'}
              justifyContent={'center'}
              gap={12}
            >
              <EditorActionButton
                icon="crop"
                label="자르기"
                disabled={isCurrentItemVideo}
                onPress={onCrop}
              />
              <EditorActionButton
                icon="layers"
                label="필터"
                disabled={isCurrentItemVideo}
                onPress={onFilter}
              />
            </ContentContainer>
          </ContentContainer>
        </ContentContainer>
      </ScreenContainer>

      <PhotoFilterBottomSheet
        opened={filterBottomSheetOpen}
        selectedImage={currentItem}
        onClose={() => setFilterBottomSheetOpen(false)}
        onApply={handleApplyFilter}
      />
    </LoadingContainer>
  );
};
export default PhotoEditorPage;
