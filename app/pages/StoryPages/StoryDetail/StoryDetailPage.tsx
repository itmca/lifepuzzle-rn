import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PageContainer } from '../../../components/ui/layout/PageContainer';
import { MediaCarousel } from '../../../components/feature/story/MediaCarousel.tsx';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useStoryStore } from '../../../stores/story.store';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../../components/ui/layout/ContentContainer.tsx';
import { BasicNavigationProps } from '../../../navigation/types.tsx';
import { Color } from '../../../constants/color.constant.ts';
import {
  CAROUSEL_WIDTH_FULL,
  MAX_CAROUSEL_HEIGHT,
} from '../../../constants/carousel.constant.ts';
import { StoryDetailMenuBottomSheet } from '../../../components/feature/story/StoryDetailMenuBottomSheet.tsx';
import { useMediaStore } from '../../../stores/media.store';
import { BodyTextM, Title } from '../../../components/ui/base/TextBase';
import PinchZoomModal from '../../../components/ui/interaction/PinchZoomModal';
import TextAreaInput from '../../../components/ui/form/TextAreaInput';
import { BasicButton } from '../../../components/ui/form/Button';
import { Divider } from '../../../components/ui/base/Divider';
import { useImageDimensions } from '../../../hooks/useImageDimensions';
import { calculateOptimalCarouselHeight } from '../../../utils/carousel-dimension.util';
import { useGalleryIndexMapping } from '../../../hooks/useGalleryIndexMapping';
import { useRenderLog } from '../../../utils/debug/render-log.util';
import type { StoryViewRouteProps } from '../../../navigation/types';
import { STORY_VIEW_SCREENS } from '../../../navigation/screens.constant';
import StoryDateInput from '../StoryWriting/StoryDateInput.tsx';
import { VoiceAddButton } from '../../../components/feature/voice/VoiceAddButton';
import { VoiceBottomSheet } from '../../../components/feature/story/VoiceBottomSheet.tsx';
import { AudioBtn } from '../../../components/feature/story/AudioBtn.tsx';
import logger from '../../../utils/logger.util.ts';

const StoryDetailPage = (): React.ReactElement => {
  // React hooks
  const [isStory, setIsStory] = useState<boolean>(false);
  const [pinchZoomModalOpen, setPinchZoomModalOpen] = useState<boolean>(false);
  const [pinchZoomImage, setPinchZoomImage] = useState<string>();
  const [voiceModalOpen, setVoiceModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [content, setContent] = useState<string>('');

  // 외부 hook 호출 (navigation, route 등)
  const navigation = useNavigation<BasicNavigationProps>();
  const route =
    useRoute<StoryViewRouteProps<typeof STORY_VIEW_SCREENS.STORY>>();

  // Route params에서 초기 galleryIndex 가져오기
  const initialGalleryIndex = route.params?.galleryIndex ?? 0;

  // 로컬 상태로 현재 갤러리 인덱스 관리
  const [allGalleryIndex, setAllGalleryIndex] = useState(initialGalleryIndex);

  // 글로벌 상태 관리
  const allGallery = useMediaStore(state => state.gallery);
  const resetWritingStory = useStoryStore(state => state.resetWritingStory);

  // Memoized 값
  const filteredGallery = useMemo(
    () => allGallery.filter(item => item.tag?.key !== 'AI_PHOTO'),
    [allGallery],
  );

  // Memoize image sources to prevent infinite loop in useImageDimensions
  const imageSourcesForDimensions = useMemo(
    () =>
      filteredGallery.map(item => ({
        uri: item.url,
        type: item.type,
      })),
    [filteredGallery],
  );

  // Custom hooks
  const imageDimensions = useImageDimensions(imageSourcesForDimensions, {
    defaultWidth: CAROUSEL_WIDTH_FULL,
    defaultHeight: MAX_CAROUSEL_HEIGHT,
    skipVideoTypes: true,
  });

  // 전체 갤러리 인덱스를 필터링된 갤러리 인덱스로 변환
  const filteredIndex = useGalleryIndexMapping(
    allGallery,
    filteredGallery,
    allGalleryIndex,
  );

  // Derived value or local variables
  const currentGalleryItem = filteredGallery[filteredIndex];

  // Debug: 렌더링 추적
  useRenderLog('StoryDetailPage', {
    allGalleryIndex,
    filteredIndex,
    filteredGalleryCount: filteredGallery.length,
    hasStory: !!currentGalleryItem?.story,
  });

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

  const openPinchZoomModal = (img: string) => {
    setPinchZoomImage(img);
    setPinchZoomModalOpen(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // TODO: API call to save story
    logger.debug('Saving content:', content);
    setIsEditing(false);
  };

  // Side effects
  useFocusEffect(
    useCallback(() => {
      resetWritingStory();
    }, [resetWritingStory]),
  );

  // Route params 변경 시 로컬 state 업데이트
  useEffect(() => {
    if (route.params?.galleryIndex !== undefined) {
      setAllGalleryIndex(route.params.galleryIndex);
    }
  }, [route.params?.galleryIndex]);

  useEffect(() => {
    setIsStory(!!currentGalleryItem?.story);
    if (currentGalleryItem?.story?.content) {
      setContent(currentGalleryItem.story.content);
      setIsEditing(false);
    } else {
      setContent('');
      setIsEditing(true);
    }
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
  }, [allGallery, allGalleryIndex, filteredGallery, filteredIndex]);

  useEffect(() => {
    if (filteredGallery.length === 0) {
      navigation.navigate('App', { screen: 'Home' });
    }
  }, [filteredGallery.length, navigation]);
  return (
    <PageContainer edges={['left', 'right', 'bottom']} isLoading={false}>
      <ScrollContentContainer gap={0} dismissKeyboardOnPress>
        <ContentContainer paddingHorizontal={20} paddingTop={20}>
          {currentGalleryItem && (
            <Title color={Color.GREY_700}>
              {currentGalleryItem.tag?.label
                ? `${currentGalleryItem.tag.label} (${filteredGallery.length})`
                : ''}
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
          <ContentContainer paddingTop={24} gap={20}>
            <ContentContainer
              useHorizontalLayout
              width={'auto'}
              gap={8}
              justifyContent={'flex-start'}
            >
              <StoryDateInput
                ageGroupLabel={currentGalleryItem.tag?.label}
                date={new Date()}
                onChange={() => {}}
              />
            </ContentContainer>
            {isEditing ? (
              <>
                <ContentContainer minHeight={60}>
                  <TextAreaInput
                    text={content}
                    onChangeText={setContent}
                    placeholder={`사진을 보며 들려주신 이야기를\n한두 줄로 남겨보세요`}
                  />
                </ContentContainer>
                <ContentContainer width={100} alignSelf="flex-start">
                  <BasicButton
                    text="완료"
                    onPress={handleSave}
                    height={40}
                    backgroundColor={Color.WHITE}
                    textColor={Color.MAIN_DARK}
                    borderColor={Color.MAIN_LIGHT}
                    borderRadius={20}
                  />
                </ContentContainer>
              </>
            ) : (
              <>
                {content && (
                  <ContentContainer gap={12}>
                    <BodyTextM color={Color.GREY_500}>{content}</BodyTextM>
                    <ContentContainer width="auto" alignSelf="flex-start">
                      <BasicButton
                        text="수정하기"
                        onPress={handleEdit}
                        backgroundColor={Color.GREY_200}
                        textColor={Color.GREY_700}
                        height={40}
                        borderRadius={20}
                      />
                    </ContentContainer>
                  </ContentContainer>
                )}
              </>
            )}
            {currentGalleryItem?.story?.audios &&
            currentGalleryItem.story.audios.length > 0 ? (
              <AudioBtn
                audioUrl={currentGalleryItem.story.audios[0]}
                onPlay={() => {
                  setVoiceModalOpen(true);
                }}
              />
            ) : (
              <VoiceAddButton
                onPress={() => {
                  setVoiceModalOpen(true);
                }}
              />
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
      <VoiceBottomSheet
        opened={voiceModalOpen}
        editable={false}
        onClose={() => {
          setVoiceModalOpen(false);
        }}
      />
    </PageContainer>
  );
};
export default StoryDetailPage;
