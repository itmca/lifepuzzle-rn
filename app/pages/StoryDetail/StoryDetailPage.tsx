import {useCallback, useMemo, useRef, useState} from 'react';
import {Dimensions, Keyboard, Pressable} from 'react-native';
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {MediaCarousel} from '../../components/story/MediaCarousel.tsx';
import {StoryItemContents} from '../../components/story-list/StoryItemContents';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {writingStoryState} from '../../recoils/story-write.recoil';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../components/styled/container/ContentContainer.tsx';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

import BottomSheet from '../../components/styled/components/BottomSheet';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {Color} from '../../constants/color.constant.ts';
import {StoryDetailMenu} from '../../components/story/StoryDetailBottomMenu.tsx';
import {
  MediumTitle,
  XSmallTitle,
} from '../../components/styled/components/Title.tsx';
import {BasicNavigationProps} from '../../navigation/types.tsx';
import {
  getGallery,
  selectedGalleryIndexState,
} from '../../recoils/photos.recoil.ts';

const StoryDetailPage = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  const [galleryIndex, setGalleryIndex] = useRecoilState(
    selectedGalleryIndexState,
  );
  const gallery = useRecoilValue(getGallery);
  const [isStory, setIsStory] = useState<boolean>(gallery[galleryIndex].story);

  const resetWritingStory = useResetRecoilState(writingStoryState);
  useFocusEffect(() => {
    resetWritingStory();
    setIsStory(gallery[galleryIndex].story);
  });

  const setWritingStory = useSetRecoilState(writingStoryState);
  const isFocused = useIsFocused();

  //bottom sheet
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [isStory ? '40%' : '20%'], [isStory]);

  const handlePresentModalPress = useCallback(() => {
    Keyboard.dismiss();
    bottomSheetModalRef.current?.present();
  }, []);
  const handleClosePress = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  const onClickWrite = () => {
    const currentGalleryItem = gallery[galleryIndex];
    setWritingStory({
      gallery: [
        {
          id: currentGalleryItem.id,
          uri: currentGalleryItem.url,
          tagKey: currentGalleryItem.tag.key,
        },
      ],
    });
    handleClosePress();
    navigation.push('NoTab', {
      screen: 'StoryWritingNavigator',
      params: {
        screen: 'StoryWritingMain',
      },
    });
  };
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="none"
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

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
                {gallery[galleryIndex].tag?.label ?? ''}
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

            <ContentContainer backgroundColor={Color.BLACK}>
              <MediaCarousel
                data={gallery.map(item => ({
                  type: item.type,
                  url: item.url,
                  index: item.index,
                }))}
                activeIndex={galleryIndex}
                isFocused={isFocused}
                carouselWidth={Dimensions.get('window').width}
                onScroll={index => {
                  setGalleryIndex(index % gallery.length);
                  setIsStory(gallery[index % gallery.length].story);
                  if (bottomSheetModalRef.current) {
                    bottomSheetModalRef.current.close();
                  }
                }}
              />
            </ContentContainer>
            <ContentContainer
              paddingHorizontal={16}
              paddingBottom={10}
              flex={1}
              expandToEnd>
              {gallery[galleryIndex]?.story ? (
                <StoryItemContents story={gallery[galleryIndex].story} />
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
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}>
          <StoryDetailMenu
            type={isStory ? 'story' : 'photo'}
            gallery={gallery[galleryIndex]}
          />
        </BottomSheet>
      </BottomSheetModalProvider>
    </LoadingContainer>
  );
};
export default StoryDetailPage;
