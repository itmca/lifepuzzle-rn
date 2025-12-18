import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PageContainer } from '../../../components/ui/layout/PageContainer';
import { MediaCarousel } from '../../../components/feature/story/MediaCarousel.tsx';
import { useNavigation, useRoute } from '@react-navigation/native';
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
import { Title } from '../../../components/ui/base/TextBase';
import PinchZoomModal from '../../../components/ui/interaction/PinchZoomModal';
import TextAreaInput from './components/TextAreaInput';
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
import {
  showToast,
  showErrorToast,
} from '../../../components/ui/feedback/Toast';
import { StoryType } from '../../../types/core/story.type';
import { useStoryDetailMutation } from '../../../services/story/story.mutation';
import { useHeroStore } from '../../../stores/hero.store';

/**
 * Modal types for StoryDetailPage
 */
type ModalType = 'none' | 'pinch-zoom' | 'voice';

const StoryDetailPage = (): React.ReactElement => {
  // React hooks - UI States
  const [isStory, setIsStory] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [pinchZoomImage, setPinchZoomImage] = useState<string>();
  const [editingGalleryId, setEditingGalleryId] = useState<number | null>(null);
  const [content, setContent] = useState<string>('');
  const [draftContents, setDraftContents] = useState<Map<number, string>>(
    new Map(),
  );
  const isContentEmpty = content.trim().length === 0;

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
  const updateGalleryStory = useMediaStore(state => state.updateGalleryStory);
  const { currentHero } = useHeroStore();

  // Memoized 값
  // filteredGallery: AI_PHOTO 태그를 제외한 갤러리 아이템들만 포함
  // (StoryDetailPage는 AI 생성 사진을 표시하지 않음)
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

  /**
   * Dual-Index System (이중 인덱스 시스템)
   *
   * - allGalleryIndex: 전체 갤러리(AI 사진 포함)에서의 현재 아이템 위치
   * - filteredIndex: 필터링된 갤러리(AI 사진 제외)에서의 현재 아이템 위치
   *
   * 이 시스템이 필요한 이유:
   * 1. 전역 state는 모든 사진(AI 포함)을 관리
   * 2. StoryDetailPage는 AI 사진을 제외한 사진만 표시
   * 3. Navigation params는 전체 갤러리 기준 인덱스를 전달
   * 4. MediaCarousel은 필터링된 갤러리 기준 인덱스를 사용
   *
   * useGalleryIndexMapping: allGalleryIndex를 filteredIndex로 변환
   */
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
  /**
   * Carousel 스크롤 시 호출되는 핸들러
   * filteredIndex -> allGalleryIndex로 역변환하여 state 업데이트
   * 현재 편집 중인 내용을 draft에 저장
   */
  const handleIndexChange = useCallback(
    (filteredIdx: number) => {
      if (filteredGallery.length === 0) {
        return;
      }

      // 0. 현재 편집 중인 내용을 draft에 저장
      if (
        currentGalleryItem &&
        editingGalleryId === currentGalleryItem.id &&
        content !== (currentGalleryItem.story?.content ?? '')
      ) {
        setDraftContents(prev => {
          const next = new Map(prev);
          next.set(currentGalleryItem.id, content);
          return next;
        });
      }

      // 1. 필터링된 갤러리에서 선택된 아이템 찾기
      const selectedItem =
        filteredGallery[filteredIdx % filteredGallery.length];

      // 2. 전체 갤러리에서 해당 아이템의 인덱스 찾기 (역변환)
      const originalIndex = allGallery.findIndex(
        item => item.id === selectedItem.id,
      );

      // 3. 전체 갤러리 기준 인덱스 업데이트
      setAllGalleryIndex(originalIndex);
      setIsStory(!!selectedItem.story);
    },
    [
      filteredGallery,
      allGallery,
      currentGalleryItem,
      editingGalleryId,
      content,
    ],
  );

  const openPinchZoomModal = (img: string) => {
    setPinchZoomImage(img);
    setActiveModal('pinch-zoom');
  };

  const handleEdit = () => {
    if (currentGalleryItem) {
      setEditingGalleryId(currentGalleryItem.id);
    }
  };

  // Story 저장 mutation (story.mutation.ts로 분리)
  const { saveTrigger, isSaving } = useStoryDetailMutation({
    galleryItem: currentGalleryItem,
    onSuccess: storyKey => {
      // Gallery store 업데이트
      const baseStory = currentGalleryItem?.story;
      const updatedStory: StoryType = {
        id: storyKey,
        heroId: currentHero?.id ?? baseStory?.heroId ?? 0,
        content: content,
        question: baseStory?.question ?? '',
        photos: baseStory?.photos ?? [],
        audios: baseStory?.audios ?? [],
        videos: baseStory?.videos ?? [],
        gallery: baseStory?.gallery ?? [],
        tags: baseStory?.tags ?? [],
        date: currentGalleryItem?.date ?? baseStory?.date ?? new Date(),
        createdAt: baseStory?.createdAt ?? new Date(),
        recordingTime: baseStory?.recordingTime,
        playingTime: baseStory?.playingTime,
      };

      updateGalleryStory(currentGalleryItem!.id, updatedStory);

      // Draft에서 제거
      setDraftContents(prev => {
        const next = new Map(prev);
        next.delete(currentGalleryItem!.id);
        return next;
      });

      // UI 상태 업데이트
      setEditingGalleryId(null);
      showToast(
        currentGalleryItem?.story?.id
          ? '이야기가 수정되었습니다'
          : '이야기가 저장되었습니다',
      );
    },
    onError: message => {
      showErrorToast(message);
    },
  });

  const handleSave = () => {
    saveTrigger(content);
  };

  // Side effects
  // Route params 변경 시 로컬 state 업데이트
  useEffect(() => {
    if (route.params?.galleryIndex !== undefined) {
      setAllGalleryIndex(route.params.galleryIndex);
    }
  }, [route.params?.galleryIndex]);

  useEffect(() => {
    if (!currentGalleryItem) {
      return;
    }

    setIsStory(!!currentGalleryItem.story);

    // Draft 우선 로드, 없으면 저장된 story content 로드
    const draftContent = draftContents.get(currentGalleryItem.id);
    const savedContent = currentGalleryItem.story?.content;

    if (draftContent !== undefined) {
      // Draft가 있으면 draft 사용하고 editing 모드로
      setContent(draftContent);
      setEditingGalleryId(currentGalleryItem.id);
    } else if (savedContent) {
      // 저장된 content가 있으면 사용하고 viewing 모드로
      setContent(savedContent);
      setEditingGalleryId(null);
    } else {
      // 둘 다 없으면 빈 content로 editing 모드
      setContent('');
      setEditingGalleryId(currentGalleryItem.id);
    }
  }, [currentGalleryItem, draftContents]);

  /**
   * Gallery 변경 시 현재 인덱스의 유효성 검증
   *
   * 실행 시점:
   * - 갤러리 아이템 삭제 시
   * - AI 사진이 추가/제거되어 필터링 결과가 변경될 때
   *
   * 검증 로직:
   * 1. 현재 allGalleryIndex가 가리키는 아이템이 여전히 filteredGallery에 존재하는지 확인
   * 2. 존재하지 않으면 안전한 fallback 인덱스로 이동
   * 3. Crash 방지 및 사용자 경험 개선
   */
  useEffect(() => {
    if (filteredGallery.length === 0) {
      return;
    }

    const currentItem = allGallery[allGalleryIndex];

    // 현재 아이템이 필터링된 갤러리에 여전히 존재하는지 확인
    const currentExists =
      currentItem && currentItem.tag?.key !== 'AI_PHOTO'
        ? filteredGallery.some(item => item.id === currentItem.id)
        : false;

    // 현재 아이템이 없거나 인덱스가 범위를 벗어나면 안전한 위치로 이동
    if (!currentExists || allGalleryIndex >= allGallery.length) {
      // Fallback: 현재 filteredIndex 위치 또는 마지막 아이템
      const fallbackItem =
        filteredGallery[Math.min(filteredIndex, filteredGallery.length - 1)] ??
        filteredGallery[filteredGallery.length - 1];

      // 전체 갤러리에서 fallback 아이템의 인덱스 찾기
      const nextIndex = allGallery.findIndex(
        item => item.id === fallbackItem.id,
      );

      // 인덱스가 유효하고 현재와 다르면 업데이트
      if (nextIndex >= 0 && nextIndex !== allGalleryIndex) {
        setAllGalleryIndex(nextIndex);
      }
    }
  }, [allGallery, allGalleryIndex, filteredGallery, filteredIndex]);

  /**
   * 빈 갤러리 처리
   * 모든 사진이 삭제되면 Home으로 자동 이동
   */
  useEffect(() => {
    if (filteredGallery.length === 0) {
      navigation.navigate('App', { screen: 'Home' });
    }
  }, [filteredGallery.length, navigation]);
  return (
    <PageContainer edges={['left', 'right', 'bottom']} isLoading={isSaving}>
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
          {/*
            MediaCarousel은 React.memo로 최적화되어 있어
            props 변경 시에만 re-render되므로 key prop 불필요
            (불필요한 key 변경은 전체 remount를 유발하여 성능 저하)
          */}
          <MediaCarousel
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
          paddingTop={8}
          flex={1}
          expandToEnd
          gap={0}
        >
          <Divider marginVertical={0} paddingHorizontal={16} height={3} />
          <ContentContainer paddingTop={24} gap={8}>
            <ContentContainer
              useHorizontalLayout
              width={'auto'}
              gap={8}
              justifyContent={'flex-start'}
            >
              <StoryDateInput
                ageGroupLabel={currentGalleryItem.tag?.label}
                date={currentGalleryItem.date}
                onChange={() => {}}
              />
            </ContentContainer>
            {editingGalleryId === currentGalleryItem?.id ? (
              <ContentContainer>
                <ContentContainer minHeight={80}>
                  <TextAreaInput
                    text={content}
                    onChangeText={setContent}
                    placeholder={`사진을 보며 들려주신 이야기를\n한두 줄로 남겨보세요`}
                    validations={[
                      {
                        condition: text => text.length <= 1000,
                        errorText: '1000자 이내로 입력해주세요',
                      },
                    ]}
                  />
                </ContentContainer>
                <ContentContainer width={100}>
                  <BasicButton
                    text="완료"
                    onPress={handleSave}
                    height={44}
                    backgroundColor={Color.WHITE}
                    textColor={Color.MAIN_DARK}
                    borderColor={Color.MAIN_LIGHT}
                    borderRadius={22}
                    disabled={isContentEmpty}
                    disabledBackgroundColor={Color.GREY_100}
                    disabledTextColor={Color.GREY_400}
                    disabledBorderColor={Color.GREY_200}
                  />
                </ContentContainer>
              </ContentContainer>
            ) : (
              <>
                {content && (
                  <ContentContainer gap={12}>
                    <ContentContainer minHeight={80} paddingVertical={8}>
                      <Title color={Color.GREY_800}>{content}</Title>
                    </ContentContainer>
                    <ContentContainer width={100}>
                      <BasicButton
                        text="수정하기"
                        onPress={handleEdit}
                        textColor={Color.GREY_500}
                        borderColor={Color.GREY_200}
                        backgroundColor={Color.WHITE}
                        height={44}
                        borderRadius={22}
                      />
                    </ContentContainer>
                  </ContentContainer>
                )}
              </>
            )}
            <ContentContainer paddingVertical={10}>
              {currentGalleryItem?.story?.audios &&
              currentGalleryItem.story.audios.length > 0 ? (
                <AudioBtn
                  audioUrl={currentGalleryItem.story.audios[0]}
                  onPlay={() => {
                    setActiveModal('voice');
                  }}
                />
              ) : (
                <VoiceAddButton
                  onPress={() => {
                    setActiveModal('voice');
                  }}
                />
              )}
            </ContentContainer>
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
        opened={activeModal === 'pinch-zoom'}
        imageUri={pinchZoomImage}
        onClose={() => setActiveModal('none')}
      />
      <VoiceBottomSheet
        opened={activeModal === 'voice'}
        editable={false}
        onClose={() => {
          setActiveModal('none');
        }}
      />
    </PageContainer>
  );
};
export default StoryDetailPage;
