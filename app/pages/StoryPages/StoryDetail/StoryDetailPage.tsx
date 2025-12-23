import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
import { BodyTextM, Title } from '../../../components/ui/base/TextBase';
import { PinchZoomModal } from '../../../components/ui/interaction/PinchZoomModal';
import { TextAreaInput, TextAreaInputRef } from './components/TextAreaInput';
import { BasicButton } from '../../../components/ui/form/Button';
import { Divider } from '../../../components/ui/base/Divider';
import { useImageDimensions } from '../../../hooks/useImageDimensions';
import { calculateOptimalCarouselHeight } from '../../../utils/carousel-dimension.util';
import { useGalleryIndexMapping } from '../../../hooks/useGalleryIndexMapping';
import { useRenderLog } from '../../../utils/debug/render-log.util';
import { formatDateWithDay } from '../../../utils/date-formatter.util';
import { useStoryDraftManager } from '../../../hooks/useStoryDraftManager';
import { StoryModelService } from '../../../services/story/story-model.service';
import type { StoryViewRouteProps } from '../../../navigation/types';
import { STORY_VIEW_SCREENS } from '../../../navigation/screens.constant';
import { VoiceAddButton } from '../../../components/feature/voice/VoiceAddButton';
import { VoiceBottomSheet } from '../../../components/feature/story/VoiceBottomSheet.tsx';
import { AudioBtn } from '../../../components/feature/story/AudioBtn.tsx';
import {
  showErrorToast,
  showToast,
} from '../../../components/ui/feedback/Toast';
import {
  useStoryContentUpsert,
  useStoryVoiceUpsert,
} from '../../../services/story/story.mutation';
import { useHeroStore } from '../../../stores/hero.store';
import { useUpdateGalleryDateAndAge } from '../../../services/gallery/gallery.mutation';
import { StoryDateAgeBottomSheet } from './components/StoryDateAgeBottomSheet';
import { AgeType } from '../../../types/core/media.type';
import { ButtonBase } from '../../../components/ui/base/ButtonBase';
import Icon from '@react-native-vector-icons/material-icons';
import { LoadingContainer } from '../../../components/ui/feedback/LoadingContainer';
import { logger } from '../../../utils/logger.util';
import { TopBar } from '../../../components/ui/navigation/TopBar';
import { DetailViewHeaderRight } from '../../../components/ui/navigation/header/DetailViewHeaderRight';

/**
 * Modal types for StoryDetailPage
 */
type ModalType = 'none' | 'pinch-zoom' | 'voice' | 'date-age' | 'detail-menu';

const StoryDetailPage = (): React.ReactElement => {
  // Refs
  const textAreaRef = useRef<TextAreaInputRef>(null);
  const prevGalleryIdRef = useRef<number | null>(null);

  // React hooks - UI States
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [pinchZoomImage, setPinchZoomImage] = useState<string>();
  const [editingGalleryId, setEditingGalleryId] = useState<number | null>(null);
  const [shouldFocusOnEdit, setShouldFocusOnEdit] = useState<boolean>(false);

  // Custom hooks - Draft Management
  const {
    content,
    setContent,
    draftContents,
    saveDraft,
    removeDraft,
    loadContentForGallery,
    hasChanges,
  } = useStoryDraftManager();

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
  const tags = useMediaStore(state => state.tags);
  const updateGalleryStory = useMediaStore(state => state.updateGalleryStory);
  const updateGalleryDateAndTag = useMediaStore(
    state => state.updateGalleryDateAndTag,
  );
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

  // 현재 보고 있는 나이대(tag)의 사진 개수 계산
  const currentTagPhotoCount = useMemo(() => {
    if (!currentGalleryItem?.tag?.key) {
      return 0;
    }
    return filteredGallery.filter(
      item => item.tag?.key === currentGalleryItem.tag?.key,
    ).length;
  }, [filteredGallery, currentGalleryItem?.tag?.key]);

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
   * 다음 아이템의 편집 상태를 미리 설정하여 레이아웃 깜빡임 방지
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
        hasChanges(
          currentGalleryItem.id,
          content,
          currentGalleryItem.story?.content,
        )
      ) {
        saveDraft(currentGalleryItem.id, content);
      }

      // 1. 필터링된 갤러리에서 선택된 아이템 찾기
      const selectedItem =
        filteredGallery[filteredIdx % filteredGallery.length];

      const isSameItem = selectedItem.id === currentGalleryItem?.id;

      // 2. 전체 갤러리에서 해당 아이템의 인덱스 찾기 (역변환)
      const originalIndex = allGallery.findIndex(
        item => item.id === selectedItem.id,
      );

      // 3. 다음 아이템의 draft/content 확인하여 편집 모드 결정 (레이아웃 깜빡임 방지)
      // 같은 아이템이면 편집 상태를 변경하지 않음 (handleEdit으로 설정한 상태 유지)
      if (!isSameItem) {
        // 다른 아이템으로 이동 시 TextAreaInput focus 제거
        textAreaRef.current?.blur();

        // loadContentForGallery hook 사용하여 content와 편집 상태 로드
        const { content: loadedContent, isEditing } =
          loadContentForGallery(selectedItem);

        setContent(loadedContent);
        setEditingGalleryId(isEditing ? selectedItem.id : null);
      }

      // 4. 전체 갤러리 기준 인덱스 업데이트
      setAllGalleryIndex(originalIndex);
    },
    [
      filteredGallery,
      allGallery,
      currentGalleryItem,
      editingGalleryId,
      content,
      draftContents,
      filteredIndex,
    ],
  );

  const openPinchZoomModal = (img: string) => {
    setPinchZoomImage(img);
    setActiveModal('pinch-zoom');
  };

  const handleEdit = () => {
    if (currentGalleryItem) {
      setEditingGalleryId(currentGalleryItem.id);
      setShouldFocusOnEdit(true);
    }
  };

  const handleDateInputPress = () => {
    setActiveModal('date-age');
  };

  // Gallery 날짜/나이대 업데이트 mutation
  const { updateDateAndAge, isPending: isUpdatingDateAndAge } =
    useUpdateGalleryDateAndAge({
      onSuccess: () => {
        showToast('날짜 및 나이대가 변경되었습니다');
      },
      onError: message => {
        showErrorToast(message);
      },
    });

  /**
   * 날짜 및 나이대 확인 핸들러
   *
   * StoryDateAgeBottomSheet에서 날짜와 나이대를 선택한 후 호출됩니다.
   * 두 단계로 업데이트를 수행합니다:
   * 1. API 호출: 서버에 변경사항 저장
   * 2. 로컬 Store 업데이트: UI에 즉시 반영 (낙관적 업데이트)
   *
   * React Query가 자동으로 캐시를 무효화하므로 별도의 refetch는 불필요합니다.
   *
   * @param date - 선택된 날짜
   * @param ageGroup - 선택된 나이대 (태그 키)
   */
  const handleDateAgeConfirm = useCallback(
    async (date: Date, ageGroup: AgeType) => {
      if (!currentGalleryItem) {
        logger.warn('handleDateAgeConfirm: currentGalleryItem is null', {
          date,
          ageGroup,
        });
        return;
      }

      try {
        // API 호출: 서버에 날짜/나이대 업데이트
        await updateDateAndAge(currentGalleryItem.id, date, ageGroup);

        // 로컬 Store 즉시 업데이트 (낙관적 업데이트)
        // 사용자에게 즉각적인 UI 피드백 제공
        updateGalleryDateAndTag(currentGalleryItem.id, date, ageGroup);
      } catch (error) {
        // Error 토스트는 mutation hook에서 이미 표시됨
        logger.error('Failed to update date and age', {
          error,
          galleryId: currentGalleryItem.id,
          date,
          ageGroup,
        });
      }
    },
    [currentGalleryItem, updateDateAndAge, updateGalleryDateAndTag],
  );

  // Story Content Upsert API 사용 (텍스트만 저장)
  const { saveContent, isSaving } = useStoryContentUpsert({
    onSuccess: storyKey => {
      // Gallery store 업데이트
      const updatedStory = StoryModelService.createFromGallery(
        storyKey,
        content,
        currentGalleryItem!,
        currentHero!,
      );

      updateGalleryStory(currentGalleryItem!.id, updatedStory);

      // Draft에서 제거
      removeDraft(currentGalleryItem!.id);

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

  /**
   * Story 텍스트 내용 저장 핸들러
   *
   * 편집 모드에서 "완료" 버튼 클릭 시 호출됩니다.
   * useStoryContentUpsert를 통해 텍스트만 서버에 저장합니다.
   *
   * 저장 성공 시:
   * - StoryModelService로 완전한 StoryType 객체 생성
   * - Gallery store 업데이트
   * - Draft 제거
   * - 뷰 모드로 전환
   */
  const handleSave = () => {
    if (!currentHero || !currentGalleryItem) {
      logger.error('handleSave: Missing required data', {
        hasHero: !!currentHero,
        hasGalleryItem: !!currentGalleryItem,
      });
      showErrorToast('저장할 수 없습니다');
      return;
    }
    saveContent(currentHero.id, currentGalleryItem.id, content);
  };

  // Story Voice Upsert API 사용 (음성만 저장)
  const { saveVoice, isSaving: isVoiceSaving } = useStoryVoiceUpsert({
    onSuccess: () => {
      // 음성 저장 성공 후 Gallery 새로고침 필요
      // React Query가 자동으로 캐시 무효화하므로 별도 처리 불필요
      showToast('음성이 저장되었습니다');
      setActiveModal('none');
    },
    onError: message => {
      showErrorToast(message);
    },
  });

  /**
   * Voice 저장 핸들러
   *
   * VoiceBottomSheet에서 녹음하거나 선택한 음성 파일을 서버에 저장합니다.
   * 음성 파일만 업로드하며, 다른 story 필드는 변경하지 않습니다.
   *
   * 저장 성공 시:
   * - React Query가 자동으로 Gallery 캐시 무효화
   * - 최신 데이터로 UI 자동 업데이트
   * - VoiceBottomSheet 닫기
   *
   * @param voiceUri - 녹음된 음성 파일의 로컬 URI
   */
  const handleVoiceSave = (voiceUri: string) => {
    if (!currentHero || !currentGalleryItem) {
      logger.error('handleVoiceSave: Missing required data', {
        hasHero: !!currentHero,
        hasGalleryItem: !!currentGalleryItem,
        voiceUri,
      });
      showErrorToast('저장할 수 없습니다');
      return;
    }
    saveVoice(currentHero.id, currentGalleryItem.id, voiceUri);
  };

  // Side effects
  // Route params 변경 시 로컬 state 업데이트
  useEffect(() => {
    if (route.params?.galleryIndex !== undefined) {
      setAllGalleryIndex(route.params.galleryIndex);
    }
  }, [route.params?.galleryIndex]);

  /**
   * 수정하기 버튼 클릭 시에만 TextAreaInput에 자동 focus
   * shouldFocusOnEdit flag가 true일 때만 focus 실행
   */
  useEffect(() => {
    if (
      shouldFocusOnEdit &&
      editingGalleryId !== null &&
      editingGalleryId === currentGalleryItem?.id
    ) {
      // 다음 렌더 사이클에 focus (조건부 렌더링된 컴포넌트 마운트 대기)
      const timer = setTimeout(() => {
        textAreaRef.current?.focus();
        setShouldFocusOnEdit(false); // focus 후 flag 리셋
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [shouldFocusOnEdit, editingGalleryId, currentGalleryItem?.id]);

  /**
   * currentGalleryItem 변경 시 content와 편집 상태 동기화
   *
   * 실행 시점:
   * 1. 초기 마운트
   * 2. Route params 변경 (외부에서 navigate로 특정 인덱스 이동)
   * 3. 사진 삭제 등으로 인한 자동 인덱스 조정
   * 4. Carousel 스크롤
   *
   * Note: 갤러리 아이템이 실제로 변경되었을 때만 동기화 실행
   * handleEdit로 수동 편집 모드 전환한 경우는 덮어쓰지 않음
   */
  useEffect(() => {
    if (!currentGalleryItem) {
      return;
    }

    // 갤러리 아이템이 실제로 변경되었는지 확인
    const galleryItemChanged =
      prevGalleryIdRef.current !== currentGalleryItem.id;

    if (galleryItemChanged) {
      prevGalleryIdRef.current = currentGalleryItem.id;

      // Draft 우선 로드, 없으면 저장된 story content 로드
      const { content: loadedContent, isEditing } =
        loadContentForGallery(currentGalleryItem);

      setContent(loadedContent);
      setEditingGalleryId(isEditing ? currentGalleryItem.id : null);
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

  /**
   * 헤더 설정
   * DetailViewHeaderRight의 customAction을 설정하여 메뉴 열기 제어
   */
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <TopBar
          title={'자세히 보기'}
          right={
            <DetailViewHeaderRight
              customAction={() => setActiveModal('detail-menu')}
            />
          }
        />
      ),
    });
  }, [navigation]);

  return (
    <PageContainer
      edges={['left', 'right', 'bottom']}
      isLoading={isUpdatingDateAndAge}
    >
      <ScrollContentContainer gap={0} dismissKeyboardOnPress>
        <ContentContainer paddingHorizontal={20} paddingTop={20}>
          {currentGalleryItem && (
            <Title color={Color.GREY_700}>
              {currentGalleryItem.tag?.label
                ? `${currentGalleryItem.tag.label} (총 ${currentTagPhotoCount}장)`
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
          <LoadingContainer isLoading={isSaving}>
            <ContentContainer paddingTop={24} gap={8}>
              <ContentContainer
                useHorizontalLayout
                width={'auto'}
                gap={8}
                justifyContent={'flex-start'}
              >
                <ButtonBase
                  height={'24px'}
                  width={'auto'}
                  backgroundColor={Color.TRANSPARENT}
                  onPress={handleDateInputPress}
                  borderInside
                  gap={2}
                >
                  {currentGalleryItem.date ? (
                    <BodyTextM color={Color.GREY_600}>
                      {`${currentGalleryItem.tag?.label} · ${formatDateWithDay(currentGalleryItem.date)}`}
                    </BodyTextM>
                  ) : (
                    <BodyTextM color={Color.GREY_600}>
                      {currentGalleryItem.tag?.label}
                    </BodyTextM>
                  )}
                  <Icon
                    name={'keyboard-arrow-down'}
                    size={20}
                    color={Color.GREY_400}
                  />
                </ButtonBase>
              </ContentContainer>
              {editingGalleryId === currentGalleryItem?.id ? (
                <ContentContainer>
                  <ContentContainer minHeight={80}>
                    <TextAreaInput
                      ref={textAreaRef}
                      text={content}
                      onChangeText={setContent}
                      placeholder={`이때의 이야기를 글로 남겨주세요.\n지금 떠오르는 기억이면 충분해요.`}
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
          </LoadingContainer>
        </ContentContainer>
      </ScrollContentContainer>

      {currentGalleryItem && (
        <StoryDetailMenuBottomSheet
          gallery={currentGalleryItem}
          opened={activeModal === 'detail-menu'}
          onClose={() => setActiveModal('none')}
        />
      )}
      <PinchZoomModal
        opened={activeModal === 'pinch-zoom'}
        imageUri={pinchZoomImage}
        onClose={() => setActiveModal('none')}
      />
      <VoiceBottomSheet
        opened={activeModal === 'voice'}
        editable={true}
        onClose={() => {
          setActiveModal('none');
        }}
        onSaveVoice={handleVoiceSave}
        voiceSource={currentGalleryItem?.story?.audios?.[0]}
      />
      {currentGalleryItem && currentHero && tags && (
        <StoryDateAgeBottomSheet
          opened={activeModal === 'date-age'}
          onClose={() => setActiveModal('none')}
          initialDate={currentGalleryItem.date}
          initialAgeGroup={
            currentGalleryItem.tag?.key !== 'AI_PHOTO'
              ? (currentGalleryItem.tag?.key as AgeType)
              : undefined
          }
          tags={tags}
          hero={currentHero}
          onConfirm={handleDateAgeConfirm}
        />
      )}
    </PageContainer>
  );
};
export { StoryDetailPage };
