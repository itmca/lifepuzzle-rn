import React, { useMemo, useState } from 'react';
import { Dimensions } from 'react-native';
import { LoadingContainer } from '../../../components/ui/feedback/LoadingContainer';
import { ScreenContainer } from '../../../components/ui/layout/ScreenContainer';
import { MediaCarousel } from '../../../components/feature/story/MediaCarousel.tsx';
import { StoryItemContents } from '../../../components/feature/story/StoryItemContents.tsx';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { useStoryStore } from '../../../stores/story.store';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../../components/ui/layout/ContentContainer.tsx';
import { Color } from '../../../constants/color.constant.ts';
import { StoryDetailMenuBottomSheet } from '../../../components/feature/story/StoryDetailMenuBottomSheet.tsx';
import { BasicNavigationProps } from '../../../navigation/types.tsx';
import { useMediaStore } from '../../../stores/media.store';
import { useSelectionStore } from '../../../stores/selection.store';
import { Title } from '../../../components/ui/base/TextBase';
import { StoryWritingButton } from '../../../components/feature/story/StoryWritingButton';
import PinchZoomModal from '../../../components/ui/interaction/PinchZoomModal';

const StoryDetailPage = (): React.ReactElement => {
  // React hooks
  const [isStory, setIsStory] = useState<boolean>(false);
  const [pinchZoomModalOpen, setPinchZoomModalOpen] = useState<boolean>(false);
  const [pinchZoomImage, setPinchZoomImage] = useState<string>();

  // 글로벌 상태 관리
  const {
    currentGalleryIndex: allGalleryIndex,
    setCurrentGalleryIndex: setAllGalleryIndex,
  } = useSelectionStore();
  const ageGroups = useMediaStore(state => state.ageGroups);
  const tags = useMediaStore(state => state.tags);
  const { resetWritingStory, setWritingStory, resetSelectedStoryKey } =
    useStoryStore();

  // Memoized gallery to avoid infinite loop (getGallery creates new array each call)
  const allGallery = useMemo(() => {
    if (!ageGroups || !tags) return [];
    return Object.entries(ageGroups)
      .map(([key, value]) => {
        const tag = tags.find(t => t.key === key);
        if (!tag) return [];
        return value.gallery.map(item => ({ ...item, tag }));
      })
      .flat();
  }, [ageGroups, tags]);

  // 외부 hook 호출 (navigation, route 등)
  const navigation = useNavigation<BasicNavigationProps>();
  const isFocused = useIsFocused();

  // Memoized 값
  const filteredGallery = useMemo(
    () => allGallery.filter(item => item.tag?.key !== 'AI_PHOTO'),
    [allGallery],
  );

  // 전체 갤러리 인덱스를 필터링된 갤러리 인덱스로 변환
  const filteredIndex = useMemo(() => {
    const currentItem = allGallery[allGalleryIndex];
    if (!currentItem || currentItem.tag?.key === 'AI_PHOTO') {
      return 0;
    }
    return filteredGallery.findIndex(item => item.id === currentItem.id);
  }, [allGallery, filteredGallery, allGalleryIndex]);

  // Derived value or local variables
  const currentGalleryItem = filteredGallery[filteredIndex];

  // Custom functions
  const handleIndexChange = (filteredIdx: number) => {
    const selectedItem = filteredGallery[filteredIdx % filteredGallery.length];
    const originalIndex = allGallery.findIndex(
      item => item.id === selectedItem.id,
    );
    setAllGalleryIndex(originalIndex);
    setIsStory(selectedItem.story);
  };

  const onClickWrite = () => {
    if (!currentGalleryItem) {
      return;
    }

    resetSelectedStoryKey();
    setWritingStory({
      gallery: [
        {
          id: currentGalleryItem.id,
          uri: currentGalleryItem.url,
          tagKey: currentGalleryItem.tag.key,
        },
      ],
    });
    navigation.navigate('App', {
      screen: 'StoryWritingNavigator',
      params: {
        screen: 'StoryWritingMain',
      },
    });
  };

  const openPinchZoomModal = (img: string) => {
    setPinchZoomImage(img);
    setPinchZoomModalOpen(true);
  };

  // Side effects
  useFocusEffect(() => {
    resetWritingStory();
    setIsStory(currentGalleryItem?.story || false);
  });
  return (
    <LoadingContainer isLoading={false}>
      <ScreenContainer>
        <ScrollContentContainer gap={0}>
          <ContentContainer paddingHorizontal={20} paddingTop={20}>
            <Title color={Color.GREY_700}>
              {currentGalleryItem?.tag?.label +
                '(' +
                currentGalleryItem?.tag?.count +
                ')'}
            </Title>
          </ContentContainer>
          <ContentContainer>
            <MediaCarousel
              data={filteredGallery.map((item, index) => ({
                type: item.type,
                url: item.url,
                index: index,
              }))}
              activeIndex={filteredIndex}
              isFocused={isFocused}
              carouselWidth={Dimensions.get('window').width}
              onScroll={handleIndexChange}
              onPress={openPinchZoomModal}
            />
          </ContentContainer>
          <ContentContainer paddingHorizontal={20} flex={1} expandToEnd>
            {currentGalleryItem?.story ? (
              <StoryItemContents story={currentGalleryItem.story} />
            ) : (
              <>
                <Title color={Color.GREY_400}>
                  사진에 담겨있는 당신의 이야기를 작성해 주세요
                </Title>
                <ContentContainer alignCenter paddingTop={36}>
                  <StoryWritingButton onPress={onClickWrite} />
                </ContentContainer>
              </>
            )}
          </ContentContainer>
        </ScrollContentContainer>
      </ScreenContainer>

      <StoryDetailMenuBottomSheet
        type={isStory ? 'story' : 'photo'}
        gallery={currentGalleryItem}
      />
      <PinchZoomModal
        opened={pinchZoomModalOpen}
        imageUri={pinchZoomImage}
        onClose={() => setPinchZoomModalOpen(false)}
      />
    </LoadingContainer>
  );
};
export default StoryDetailPage;
