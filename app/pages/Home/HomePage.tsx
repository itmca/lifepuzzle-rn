import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useShallow } from 'zustand/react/shallow';
import FastImage from '@d11/react-native-fast-image';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useHeroStore } from '../../stores/hero.store';
import { useMediaStore } from '../../stores/media.store';
import { useUIStore } from '../../stores/ui.store';
import { useSelectionStore } from '../../stores/selection.store';
import { useShareStore } from '../../stores/share.store';
import { BasicNavigationProps } from '../../navigation/types.tsx';
import { PageContainer } from '../../components/ui/layout/PageContainer';
import { ContentContainer } from '../../components/ui/layout/ContentContainer.tsx';
import { ApiErrorFallback } from '../../components/ui/feedback/ApiErrorFallback';
import { useGalleries } from '../../services/gallery/gallery.query';
import { useUploadGallery } from '../../services/gallery/gallery.mutation';
import { Gallery } from './components/gallery/Gallery.tsx';
import { GalleryBottomButton } from './components/gallery/GalleryBottomButton.tsx';
import { HeroSection } from './components/hero/HeroSection.tsx';
import { BottomSheetSection } from './components/bottom-sheet/BottomSheetSection.tsx';
import { LoadingContainer } from '../../components/ui/feedback/LoadingContainer';
import { useRenderLog } from '../../utils/debug/render-log.util';

/**
 * BottomSheet types for HomePage
 */
export type HomeBottomSheetType =
  | 'none'
  | 'hero-share'
  | 'received-image'
  | 'media-picker';

const HomePage = (): React.ReactElement => {
  // React hooks - UI States
  const [activeBottomSheet, setActiveBottomSheet] =
    useState<HomeBottomSheetType>('none');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [scrollY, setScrollY] = useState<number>(0);
  const [heroCollapseProgress, setHeroCollapseProgress] = useState<number>(0);
  const [hasLoadedOnce, setHasLoadedOnce] = useState<boolean>(false);

  // 글로벌 상태 관리 (Zustand)
  const hero = useHeroStore(state => state.currentHero);
  const ageGroups = useMediaStore(state => state.ageGroups);
  const tags = useMediaStore(state => state.tags);
  const { selectedTag, setSelectedTag } = useSelectionStore(
    useShallow(state => ({
      selectedTag: state.selectedTag,
      setSelectedTag: state.setSelectedTag,
    })),
  );
  const isGalleryUploading = useUIStore(state => state.isGalleryUploading);
  const sharedImageData = useShareStore(state => state.sharedImageData);

  // 외부 hook 호출 (navigation, route 등)
  const navigation = useNavigation<BasicNavigationProps>();

  // Custom hooks
  const { isLoading, isFetching, isError, hasInitialData, refetch } =
    useGalleries();
  const { uploadGallery } = useUploadGallery();

  // Debug: 렌더링 추적
  useRenderLog('HomePage', {
    heroId: hero?.id,
    galleryCount: ageGroups ? Object.keys(ageGroups).length : 0,
    selectedTagKey: selectedTag?.key,
    isGalleryUploading,
    isLoading,
  });

  // Custom functions (핸들러, 로직 함수 등)
  const handleHeroSharePress = useCallback(() => {
    setActiveBottomSheet('hero-share');
  }, []);

  const handleCloseBottomSheet = useCallback(() => {
    setActiveBottomSheet('none');
  }, []);

  const handleRefetch = useCallback(() => {
    if (refetch && hero?.id && hero.id >= 0) {
      refetch();
    }
  }, [hero?.id, refetch]);

  const handlePullToRefresh = useCallback(() => {
    if (!isRefreshing && scrollY <= 0) {
      setIsRefreshing(true);
      if (refetch && hero?.id && hero.id >= 0) {
        refetch();
      }
    }
  }, [hero?.id, isRefreshing, refetch, scrollY]);

  const handleGalleryButtonPress = useCallback(() => {
    if (selectedTag?.key === 'AI_PHOTO') {
      navigation.navigate('App', {
        screen: 'AiPhotoNavigator',
        params: {
          screen: 'AiPhotoWorkHistory',
        },
      });
    } else {
      setActiveBottomSheet('media-picker');
    }
  }, [selectedTag?.key, navigation]);

  const imageUrls = useMemo(() => {
    if (!ageGroups || Object.keys(ageGroups).length === 0) {
      return [];
    }
    return Object.values(ageGroups).flatMap(ageGroup =>
      ageGroup.gallery.map(photo => ({ uri: photo.url })),
    );
  }, [ageGroups]);

  const handleGalleryScrollYChange = useCallback((offsetY: number) => {
    setScrollY(offsetY);

    const clampedOffset = Math.max(0, offsetY);
    const expandThreshold = 20;
    const collapseThreshold = 100;

    let nextProgress = 0;
    if (clampedOffset <= expandThreshold) {
      nextProgress = 0;
    } else if (clampedOffset >= collapseThreshold) {
      nextProgress = 1;
    } else {
      nextProgress =
        (clampedOffset - expandThreshold) /
        (collapseThreshold - expandThreshold);
    }

    setHeroCollapseProgress(prev =>
      Math.abs(prev - nextProgress) < 0.02 ? prev : nextProgress,
    );
  }, []);

  // Ref to track previous image URLs for optimized preloading
  const prevImageUrlsRef = useRef<{ uri: string }[]>([]);

  // Side effects (useEffect 등)
  // Optimized FastImage.preload - only preload when URLs actually change
  useEffect(() => {
    if (imageUrls.length === 0) return;

    // Compare with previous URLs to avoid unnecessary preloading
    const prevUrls = prevImageUrlsRef.current;
    const isSame =
      prevUrls.length === imageUrls.length &&
      prevUrls.every((prev, idx) => prev.uri === imageUrls[idx]?.uri);

    if (!isSame) {
      FastImage.preload(imageUrls);
      prevImageUrlsRef.current = imageUrls;
    }
  }, [imageUrls]);

  useEffect(() => {
    if (
      sharedImageData?.type &&
      hero?.name &&
      selectedTag?.key &&
      activeBottomSheet === 'none'
    ) {
      setActiveBottomSheet('received-image');
    }
  }, [sharedImageData?.type, hero?.name, selectedTag?.key, activeBottomSheet]);

  useEffect(() => {
    // Only validate selectedTag on initial load, not during refresh
    if (!tags?.length || isFetching) {
      return;
    }

    const isSelectedValid = tags.some(tag => tag.key === selectedTag?.key);
    if (!isSelectedValid) {
      setSelectedTag({ ...tags[0] });
    }
  }, [tags, selectedTag?.key, setSelectedTag, isFetching]);

  useEffect(() => {
    if (!isLoading && !hasLoadedOnce) {
      setHasLoadedOnce(true);
    }
  }, [isLoading, hasLoadedOnce]);

  useEffect(() => {
    if (!isFetching && isRefreshing) {
      setIsRefreshing(false);
    }
  }, [isFetching, isRefreshing]);

  // Close all bottom sheets when navigating away from this screen
  useFocusEffect(
    useCallback(() => {
      return () => {
        setActiveBottomSheet('none');
      };
    }, []),
  );

  // Hero 데이터가 없는 경우 로딩 화면 표시 (초기 로딩 대기)
  if (!hero) {
    return (
      <LoadingContainer isLoading={true}>
        <></>
      </LoadingContainer>
    );
  }

  // API 에러가 발생한 경우 에러 화면 표시
  if (!isLoading && isError && !hasInitialData) {
    return (
      <ApiErrorFallback
        title="데이터를 불러올 수 없습니다"
        message="네트워크 연결을 확인하고 다시 시도해주세요."
        onRetry={handleRefetch}
        retryText="다시 시도"
      />
    );
  }

  return (
    <PageContainer
      gap={0}
      alignItems="stretch"
      edges={['left', 'right', 'bottom']}
      isLoading={(!hasLoadedOnce && isLoading) || isGalleryUploading}
    >
      <ContentContainer flex={1} gap={0}>
        {/* 상단 프로필 영역 */}
        <HeroSection
          onSharePress={handleHeroSharePress}
          collapseProgress={heroCollapseProgress}
        />

        {/* 중간 사진 영역 */}
        <ContentContainer flex={1}>
          <Gallery
            isError={isError}
            hasInitialData={hasInitialData}
            onRetry={handleRefetch}
            onScrollYChange={handleGalleryScrollYChange}
            isRefreshing={isRefreshing}
            onRefresh={handlePullToRefresh}
            isFetching={isFetching}
            hasLoadedOnce={hasLoadedOnce}
          />
        </ContentContainer>
      </ContentContainer>

      {/* 하단 버튼 영역 */}
      {hero && hero.auth !== 'VIEWER' && activeBottomSheet === 'none' && (
        <GalleryBottomButton onPress={handleGalleryButtonPress} />
      )}

      {/* 바텀 시트 영역 */}
      <BottomSheetSection
        activeBottomSheet={activeBottomSheet}
        onCloseBottomSheet={handleCloseBottomSheet}
        isGalleryUploading={isGalleryUploading}
        onSubmitGallery={uploadGallery}
        onRefetch={handleRefetch}
      />
    </PageContainer>
  );
};

export { HomePage };
