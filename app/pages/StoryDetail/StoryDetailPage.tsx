import {useCallback, useMemo, useRef, useState} from 'react';
import {Dimensions, Image, Keyboard, Pressable} from 'react-native';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {MediaCarousel} from '../../components/story/MediaCarousel.tsx';
import {StoryItemContents} from '../../components/story-list/StoryItemContents';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {writingStoryState} from '../../recoils/story-write.recoil';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../components/styled/container/ContentContainer.tsx';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import BottomSheet from '../../components/styled/components/BottomSheet';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {Color} from '../../constants/color.constant.ts';
import {StoryDetailMenu} from '../../components/story/StoryDetailBottomMenu.tsx';
import {
  MediumTitle,
  XSmallTitle,
} from '../../components/styled/components/Title.tsx';
import {BasicNavigationProps} from '../../navigation/types.tsx';
import {toPhotoIdentifier} from '../../service/story-display.service.ts';
import {
  selectedGalleryIndexState,
  tagState,
  selectedTagState,
  getGallery,
} from '../../recoils/photos.recoil.ts';
import {TagType} from '../../types/photo.type.ts';

const StoryDetailPage = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  const [galleryIndex, setGalleryIndex] = useRecoilState(
    selectedGalleryIndexState,
  );
  const [selectedTag, setSelectedTag] = useRecoilState(selectedTagState);
  const [tags, setTags] = useRecoilState<TagType[]>(tagState);

  const gallery = useRecoilValue(getGallery);
  const [isStory, setIsStory] = useState<boolean>(
    gallery[galleryIndex - 1].story,
  );
  const [width, setWidth] = useState<number>(Dimensions.get('window').width);
  const [height, setHeight] = useState<number>(
    Dimensions.get('window').height * 0.55,
  );
  const setWritingStory = useSetRecoilState(writingStoryState);
  const isFocused = useIsFocused();

  //bottom sheet
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [isStory ? '35%' : '15%'], []);
  const handlePresentModalPress = useCallback(() => {
    Keyboard.dismiss();
    bottomSheetModalRef.current?.present();
  }, []);
  const handleClosePress = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  if (!galleryIndex) {
    return <></>;
  }
  const onClickWrite = () => {
    setWritingStory({
      //date: photos[galleryIndex].story?.date,
      photos: [toPhotoIdentifier(gallery[galleryIndex - 1].url)] || [],
      videos: [],
    });

    navigation.push('NoTab', {
      screen: 'StoryWritingNavigator',
      params: {
        screen: 'StoryWritingMain',
      },
    });
    //닫기
  };
  const fetchImageSize = async (index: number) => {
    try {
      const {width, height} = await new Promise((resolve, reject) => {
        Image.getSize(
          gallery[index - 1].url,
          (width, height) => {
            resolve({width, height});
          },
          error => reject(error),
        );
      });
      const DeviceWidth = Dimensions.get('window').width;
      const maxHeight = Dimensions.get('window').height * 0.55;

      const carouselHeight = height < maxHeight ? height : maxHeight;
      const carouselWidth =
        height < maxHeight ? width : (width * maxHeight) / height;
      if (carouselWidth > DeviceWidth) {
        setWidth(DeviceWidth);
        setHeight((carouselWidth * height) / width);
      } else {
        setWidth(carouselWidth);
        setHeight(carouselHeight);
      }
    } catch (error) {
      console.error('Failed to get size for image:', error);
    }
  };
  return (
    <LoadingContainer isLoading={false}>
      <BottomSheetModalProvider>
        <ScreenContainer>
          <ScrollContentContainer gap={16}>
            <ContentContainer
              useHorizontalLayout
              paddingHorizontal={16}
              alignItems="flex-end"
              height={Dimensions.get('window').height * 0.1 + 'px' ?? '10%'}>
              <MediumTitle>
                {gallery[galleryIndex - 1].tag?.label ?? ''}
              </MediumTitle>
              <Pressable
                style={{marginLeft: 'auto'}}
                onPress={handlePresentModalPress}>
                <Icon
                  name="more-horiz"
                  size={23}
                  color={Color.FONT_GRAY}
                  style={{marginRight: -5}}
                />
              </Pressable>
            </ContentContainer>

            <ContentContainer
              backgroundColor={Color.BLACK}
              style={{
                height: 'auto',
              }}>
              <MediaCarousel
                data={gallery.map(item => ({
                  type: item.type,
                  url: item.url,
                }))}
                activeIndex={galleryIndex - 1}
                isFocused={isFocused}
                carouselWidth={width}
                carouselHeight={height}
                onScroll={index => {
                  fetchImageSize((index % gallery.length) + 1);
                  if (bottomSheetModalRef.current) {
                    bottomSheetModalRef.current.close();
                  }
                  setGalleryIndex((index % gallery.length) + 1);
                }}
              />
            </ContentContainer>
            <ContentContainer paddingHorizontal={16} paddingBottom={10}>
              {gallery[galleryIndex - 1]?.story ? (
                <StoryItemContents
                  inDetail={true}
                  story={gallery[galleryIndex - 1].story}
                />
              ) : (
                <Pressable onPress={onClickWrite}>
                  <ContentContainer
                    useHorizontalLayout
                    justifyContent={'flex-start'}
                    paddingHorizontal={16}
                    gap={2.5}
                    width={'165px'}
                    height={'48px'}
                    borderRadius={32}
                    backgroundColor={Color.PRIMARY_LIGHT}
                    withUpperShadow>
                    <Icon
                      size={20}
                      name={'add-circle'}
                      color={Color.WHITE}
                      style={{margin: 2}}
                    />
                    <XSmallTitle color={Color.WHITE}>
                      이야기 작성하기
                    </XSmallTitle>
                  </ContentContainer>
                </Pressable>
              )}
            </ContentContainer>
          </ScrollContentContainer>
        </ScreenContainer>
        <BottomSheet
          ref={bottomSheetModalRef}
          index={1}
          onDismiss={handleClosePress}
          snapPoints={snapPoints}>
          <StoryDetailMenu type={isStory ? 'story' : 'photo'} />
        </BottomSheet>
      </BottomSheetModalProvider>
    </LoadingContainer>
  );
};
export default StoryDetailPage;
