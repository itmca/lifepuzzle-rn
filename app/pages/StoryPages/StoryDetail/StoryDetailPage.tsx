import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions } from 'react-native';
import { LoadingContainer } from '../../../components/ui/feedback/LoadingContainer';
import { ScreenContainer } from '../../../components/ui/layout/ScreenContainer';
import { MediaCarousel } from '../../../components/feature/story/MediaCarousel.tsx';
import { StoryItemContents } from '../../../components/feature/story/StoryItemContents.tsx';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
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
  const allGallery = useMediaStore(state => state.gallery);
  const { resetWritingStory, setWritingStory, resetSelectedStoryKey } =
    useStoryStore();

  // 외부 hook 호출 (navigation, route 등)
  const navigation = useNavigation<BasicNavigationProps>();

  // Memoized 값
  const filteredGallery = useMemo(
    () => allGallery.filter(item => item.tag?.key !== 'AI_PHOTO'),
    [allGallery],
  );

  // 전체 갤러리 인덱스를 필터링된 갤러리 인덱스로 변환
  const filteredIndex = useMemo(() => {
    if (filteredGallery.length === 0) {
      return 0;
    }
    const currentItem = allGallery[allGalleryIndex];
    const idx =
      currentItem && currentItem.tag?.key !== 'AI_PHOTO'
        ? filteredGallery.findIndex(item => item.id === currentItem.id)
        : -1;
    const safeIdx = idx < 0 ? 0 : idx;
    return Math.min(safeIdx, filteredGallery.length - 1);
  }, [allGallery, filteredGallery, allGalleryIndex]);

  // Derived value or local variables
  const currentGalleryItem = filteredGallery[filteredIndex];

  // Memoized carousel data to prevent unnecessary re-renders
  const carouselData = useMemo(
    () =>
      filteredGallery.map((item, index) => ({
        type: item.type,
        url: item.url,
        index: index,
      })),
    [filteredGallery],
  );

  // Custom functions
  const handleIndexChange = useCallback(
    (filteredIdx: number) => {
      if (filteredGallery.length === 0) {
        return;
      }

      const selectedItem =
        filteredGallery[filteredIdx % filteredGallery.length];
      const originalIndex = allGallery.findIndex(
        item => item.id === selectedItem.id,
      );
      setAllGalleryIndex(originalIndex);
      setIsStory(!!selectedItem.story);
    },
    [filteredGallery, allGallery, setAllGalleryIndex],
  );

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
  useFocusEffect(
    useCallback(() => {
      resetWritingStory();
    }, [resetWritingStory]),
  );

  useEffect(() => {
    setIsStory(!!currentGalleryItem?.story);
  }, [currentGalleryItem?.story]);

  useEffect(() => {
    if (filteredGallery.length === 0) {
      return;
    }

    const currentItem = allGallery[allGalleryIndex];
    const currentExists =
      currentItem && currentItem.tag?.key !== 'AI_PHOTO'
        ? filteredGallery.some(item => item.id === currentItem.id)
        : false;

    if (!currentExists || allGalleryIndex >= allGallery.length) {
      const fallbackItem =
        filteredGallery[Math.min(filteredIndex, filteredGallery.length - 1)] ??
        filteredGallery[filteredGallery.length - 1];
      const nextIndex = allGallery.findIndex(
        item => item.id === fallbackItem.id,
      );
      if (nextIndex >= 0 && nextIndex !== allGalleryIndex) {
        setAllGalleryIndex(nextIndex);
      }
    }
  }, [
    allGallery,
    allGalleryIndex,
    filteredGallery,
    filteredIndex,
    setAllGalleryIndex,
  ]);

  useEffect(() => {
    if (filteredGallery.length === 0) {
      navigation.navigate('App', { screen: 'Home' });
    }
  }, [filteredGallery.length, navigation]);
  return (
    <LoadingContainer isLoading={false}>
      <ScreenContainer edges={['left', 'right', 'bottom']}>
        <ScrollContentContainer gap={0}>
          <ContentContainer paddingHorizontal={20} paddingTop={20}>
            {currentGalleryItem && (
              <Title color={Color.GREY_700}>
                {`${currentGalleryItem.tag?.label ?? ''}(${filteredGallery.length})`}
              </Title>
            )}
          </ContentContainer>
          <ContentContainer>
            <MediaCarousel
              key={`carousel-${filteredGallery.length}-${filteredGallery[0]?.id ?? 'empty'}`}
              data={carouselData}
              activeIndex={filteredIndex}
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

      {currentGalleryItem && (
        <StoryDetailMenuBottomSheet
          type={isStory ? 'story' : 'photo'}
          gallery={currentGalleryItem}
        />
      )}
      <PinchZoomModal
        opened={pinchZoomModalOpen}
        imageUri={pinchZoomImage}
        onClose={() => setPinchZoomModalOpen(false)}
      />
    </LoadingContainer>
  );
};
export default StoryDetailPage;
