import React, { useState } from 'react';
import { Dimensions, Image, TouchableOpacity } from 'react-native';

import logger from '../../../utils/logger';
import { LoadingContainer } from '../../../components/ui/feedback/LoadingContainer';
import { ScreenContainer } from '../../../components/ui/layout/ScreenContainer';
import { MediaCarousel } from '../../../components/feature/story/MediaCarousel.tsx';
import { useNavigation } from '@react-navigation/native';
import { ContentContainer } from '../../../components/ui/layout/ContentContainer.tsx';

import { Color } from '../../../constants/color.constant.ts';
import { BasicNavigationProps } from '../../../navigation/types.tsx';
import { useSelectionStore } from '../../../stores/selection.store';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/SimpleLineIcons.js';
import { CustomAlert } from '../../../components/ui/feedback/CustomAlert';
import { Title } from '../../../components/ui/base/TextBase';

const PhotoEditorPage = (): React.ReactElement => {
  // React hooks
  const [contentContainerHeight, setContentContainerHeight] = useState(0);

  // 글로벌 상태 관리 (Zustand)
  const {
    editGalleryItems,
    setEditGalleryItems,
    currentGalleryIndex: galleryIndex,
    setCurrentGalleryIndex: setGalleryIndex,
  } = useSelectionStore();

  // 외부 hook 호출 (navigation, route 등)
  const navigation = useNavigation<BasicNavigationProps>();

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
    navigation.navigate('App', {
      screen: 'StoryWritingNavigator',
      params: {
        screen: 'PhotoFilter',
      },
    });
  };
  const onContentContainerLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    // logger.debug('ContentContainer Height:', height);
    setContentContainerHeight(height);
  };
  return (
    <LoadingContainer isLoading={false}>
      <ScreenContainer edges={['left', 'right', 'bottom']}>
        <ContentContainer
          flex={1}
          alignItems="center"
          justifyContent="center"
          onLayout={onContentContainerLayout}
        >
          <MediaCarousel
            data={editGalleryItems.map((item, index) => ({
              type: 'IMAGE',
              url: item.node.image.uri,
              index: index,
            }))}
            activeIndex={galleryIndex}
            carouselWidth={Dimensions.get('window').width}
            carouselMaxHeight={contentContainerHeight}
            onScroll={index => {
              setGalleryIndex(index % editGalleryItems.length);
            }}
            showAiPhotoButton={false}
          />
        </ContentContainer>
        <ContentContainer
          height={60}
          useHorizontalLayout
          withBorder
          withContentPadding
          style={{
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isCurrentItemVideo ? 0.3 : 1,
            }}
            onPress={onCrop}
            disabled={isCurrentItemVideo}
          >
            <ContentContainer useHorizontalLayout justifyContent={'center'}>
              <Icon
                name="crop"
                size={20}
                color={isCurrentItemVideo ? Color.GREY_300 : 'black'}
              />
              <Title color={isCurrentItemVideo ? Color.GREY_300 : Color.BLACK}>
                자르기
              </Title>
            </ContentContainer>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isCurrentItemVideo ? 0.3 : 1,
            }}
            onPress={onFilter}
            disabled={isCurrentItemVideo}
          >
            <ContentContainer useHorizontalLayout justifyContent={'center'}>
              <Icon
                name="layers"
                size={20}
                color={isCurrentItemVideo ? Color.GREY_300 : 'black'}
              />
              <Title color={isCurrentItemVideo ? Color.GREY_300 : Color.BLACK}>
                필터
              </Title>
            </ContentContainer>
          </TouchableOpacity>
        </ContentContainer>
      </ScreenContainer>
    </LoadingContainer>
  );
};
export default PhotoEditorPage;
