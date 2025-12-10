import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PageContainer } from '../../../components/ui/layout/PageContainer';
import { MediaCarousel } from '../../../components/feature/story/MediaCarousel.tsx';
import { StoryItemContents } from '../../../components/feature/story/StoryItemContents.tsx';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useStoryStore } from '../../../stores/story.store';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../../components/ui/layout/ContentContainer.tsx';
import { Color } from '../../../constants/color.constant.ts';
import {
  CAROUSEL_WIDTH_FULL,
  MAX_CAROUSEL_HEIGHT,
} from '../../../constants/carousel.constant.ts';
import { StoryDetailMenuBottomSheet } from '../../../components/feature/story/StoryDetailMenuBottomSheet.tsx';
import { BasicNavigationProps } from '../../../navigation/types.tsx';
import { useMediaStore } from '../../../stores/media.store';
import { useSelectionStore } from '../../../stores/selection.store';
import { Title } from '../../../components/ui/base/TextBase';
import { StoryWritingButton } from '../../../components/feature/story/StoryWritingButton';
import PinchZoomModal from '../../../components/ui/interaction/PinchZoomModal';
import { Divider } from '../../../components/ui/base/Divider';
import { useImageDimensions } from '../../../hooks/useImageDimensions';
import { calculateOptimalCarouselHeight } from '../../../utils/carousel-dimension.util';
import { useGalleryIndexMapping } from '../../../hooks/useGalleryIndexMapping';
import { StoryNavigationService } from '../../../services/story/story-navigation.service';

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
  const { resetWritingStory } = useStoryStore();

  // 외부 hook 호출 (navigation, route 등)
  const navigation = useNavigation<BasicNavigationProps>();

  // Memoized 값
  const filteredGallery = useMemo(
    () => allGallery.filter(item => item.tag?.key !== 'AI_PHOTO'),
    [allGallery],
  );

  // Custom hooks
  const imageDimensions = useImageDimensions(
    filteredGallery.map(item => ({
      uri: item.url,
      type: item.type,
    })),
    {
      defaultWidth: CAROUSEL_WIDTH_FULL,
      defaultHeight: MAX_CAROUSEL_HEIGHT,
      skipVideoTypes: true,
    },
  );

  // 전체 갤러리 인덱스를 필터링된 갤러리 인덱스로 변환
  const filteredIndex = useGalleryIndexMapping(
    allGallery,
    filteredGallery,
    allGalleryIndex,
  );

  // Derived value or local variables
  const currentGalleryItem = filteredGallery[filteredIndex];

  // Memoized carousel data to prevent unnecessary re-renders
  const carouselData = useMemo(
    () =>
      filteredGallery.map((item, index) => ({
        type: item.type,
        url: item.url,
        index: index,
        width: imageDimensions[index]?.width,
        height: imageDimensions[index]?.height,
      })),
    [filteredGallery, imageDimensions],
  );

  // 이미지 비율에 맞는 최적의 캐러셀 높이 계산
  const optimalCarouselHeight = useMemo(
    () =>
      calculateOptimalCarouselHeight(
        imageDimensions,
        CAROUSEL_WIDTH_FULL,
        MAX_CAROUSEL_HEIGHT,
      ),
    [imageDimensions],
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

    const dimensions = imageDimensions[filteredIndex];
    StoryNavigationService.navigateToWrite(
      navigation,
      currentGalleryItem,
      dimensions,
    );
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
    <PageContainer edges={['left', 'right', 'bottom']} isLoading={false}>
      <ScrollContentContainer gap={0}>
        <ContentContainer paddingHorizontal={20} paddingTop={20}>
          {currentGalleryItem && (
            <Title color={Color.GREY_700}>
              {`${currentGalleryItem.tag?.label ?? ''}(${filteredGallery.length})`}
            </Title>
          )}
        </ContentContainer>
        <ContentContainer paddingVertical={4}>
          <MediaCarousel
            key={`carousel-${filteredGallery.length}-${filteredGallery[0]?.id ?? 'empty'}`}
            data={carouselData}
            activeIndex={filteredIndex}
            carouselWidth={CAROUSEL_WIDTH_FULL}
            carouselMaxHeight={optimalCarouselHeight}
            onScroll={handleIndexChange}
            onPress={openPinchZoomModal}
          />
        </ContentContainer>
        <ContentContainer
          paddingHorizontal={20}
          paddingTop={4}
          flex={1}
          expandToEnd
          gap={0}
        >
          <Divider marginVertical={0} paddingHorizontal={16} height={3} />
          <ContentContainer paddingTop={24}>
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
        </ContentContainer>
      </ScrollContentContainer>

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
    </PageContainer>
  );
};
export default StoryDetailPage;
