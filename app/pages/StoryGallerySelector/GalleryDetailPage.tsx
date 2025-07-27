import {useState} from 'react';
import {Dimensions, Image, TouchableOpacity} from 'react-native';
import {useRecoilState} from 'recoil';
import {LoadingContainer} from '../../components/loadding/LoadingContainer.tsx';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer.tsx';
import {MediaCarousel} from '../../components/story/MediaCarousel.tsx';
import {useNavigation} from '@react-navigation/native';
import {ContentContainer} from '../../components/styled/container/ContentContainer.tsx';

import {Color} from '../../constants/color.constant.ts';
import {BasicNavigationProps} from '../../navigation/types.tsx';
import {selectedGalleryIndexState} from '../../recoils/photos.recoil.ts';
import {editedGalleryItemsState} from '../../recoils/gallery-write.recoil.ts';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/SimpleLineIcons.js';
import {CustomAlert} from '../../components/alert/CustomAlert.tsx';
import {Title} from '../../components/styled/components/Text.tsx';

const GalleryDetailPage = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  const [galleryIndex, setGalleryIndex] = useRecoilState(
    selectedGalleryIndexState,
  );
  const [editGalleryItems, setEditGalleryItems] = useRecoilState(
    editedGalleryItemsState,
  );
  const [contentContainerHeight, setContentContainerHeight] = useState(0);

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
        console.log(image.node.image.width, image.node.image.height); // Log the final path

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
        console.log(`이미지 ${image.node.image.uri} 크롭 오류:`, cropError);
        // 오류 처리 (예: 해당 이미지는 건너뛰기)
      }
    } else {
      CustomAlert.simpleAlert('크롭할 이미지가 선택되지 않았습니다.');
    }
  };
  const onFilter = () => {
    navigation.push('NoTab', {
      screen: 'StoryWritingNavigator',
      params: {
        screen: 'GalleryDetailFilter',
      },
    });
  };
  const onContentContainerLayout = event => {
    const {height} = event.nativeEvent.layout;
    // console.log('ContentContainer Height:', height); // 디버깅용
    setContentContainerHeight(height);
  };
  return (
    <LoadingContainer isLoading={false}>
      <ScreenContainer>
        <ContentContainer
          flex={1}
          alignItems="center"
          justifyContent="center"
          onLayout={onContentContainerLayout}>
          <MediaCarousel
            data={editGalleryItems.map((item, index) => ({
              type: 'IMAGE',
              url: item.node.image.uri,
              index: index + 1,
            }))}
            activeIndex={galleryIndex}
            carouselWidth={Dimensions.get('window').width}
            carouselMaxHeight={contentContainerHeight}
            onScroll={index => {
              setGalleryIndex(index % editGalleryItems.length);
              //setGalleryIndex(index % gallery.length);
              //setIsStory(gallery[index % gallery.length].story);
            }}
            // onPress={openPinchZoomModal}
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
          }}>
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={onCrop}>
            <ContentContainer useHorizontalLayout justifyContent={'center'}>
              <Icon name="crop" size={20} color={'black'} />
              <Title>자르기</Title>
            </ContentContainer>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={onFilter}>
            <ContentContainer useHorizontalLayout justifyContent={'center'}>
              <Icon name="layers" size={20} color={'black'} />
              <Title>필터</Title>
            </ContentContainer>
          </TouchableOpacity>
        </ContentContainer>
      </ScreenContainer>
    </LoadingContainer>
  );
};
export default GalleryDetailPage;
