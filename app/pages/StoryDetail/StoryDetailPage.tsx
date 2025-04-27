import {useCallback, useMemo, useState} from 'react';
import {Dimensions} from 'react-native';
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
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import BottomSheet from '../../components/styled/components/BottomSheet';

import {Color} from '../../constants/color.constant.ts';
import {StoryDetailMenu} from '../../components/story/StoryDetailBottomMenu.tsx';
import {BasicNavigationProps} from '../../navigation/types.tsx';
import {
  getGallery,
  selectedGalleryIndexState,
} from '../../recoils/photos.recoil.ts';
import {
  OpenDetailBottomSheet,
  SelectedStoryKeyState,
} from '../../recoils/story-view.recoil.ts';
import {Title} from '../../components/styled/components/Text.tsx';
import {StoryWritingButton} from '../../components/button/StoryWritingButton.tsx';

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

  const resetSelectedStory = useResetRecoilState(SelectedStoryKeyState);
  const isFocused = useIsFocused();

  //bottom sheet
  const [openModal, setOpenModal] = useRecoilState(OpenDetailBottomSheet);
  const snapPoints = useMemo(() => [isStory ? '40%' : '20%'], [isStory]);
  const handleClosePress = useCallback(() => {
    setOpenModal(false);
  }, []);

  const onClickWrite = () => {
    const currentGalleryItem = gallery[galleryIndex];
    resetSelectedStory();
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
  return (
    <LoadingContainer isLoading={false}>
      <BottomSheetModalProvider>
        <ScreenContainer>
          <ScrollContentContainer gap={0}>
            <ContentContainer paddingHorizontal={20} paddingTop={20}>
              <Title color={Color.GREY_700}>
                {gallery[galleryIndex].tag?.label +
                  '(' +
                  gallery[galleryIndex].tag?.count +
                  ')' ?? ''}
              </Title>
            </ContentContainer>
            <ContentContainer>
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
                  if (openModal) {
                    setOpenModal(false);
                  }
                }}
              />
            </ContentContainer>
            <ContentContainer paddingHorizontal={20} flex={1} expandToEnd>
              {gallery[galleryIndex]?.story ? (
                <StoryItemContents story={gallery[galleryIndex].story} />
              ) : (
                <>
                  <Title color={Color.GREY_400}>
                    사진에 담겨있는 당신의 이야기를 작성해 주세요
                  </Title>
                  <ContentContainer alignCenter paddingTop={36}>
                    <StoryWritingButton
                      onPress={onClickWrite}></StoryWritingButton>
                  </ContentContainer>
                </>
              )}
            </ContentContainer>
          </ScrollContentContainer>
        </ScreenContainer>
        <BottomSheet
          opened={openModal}
          snapPoints={snapPoints}
          onClose={() => {
            setOpenModal(false);
          }}>
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
