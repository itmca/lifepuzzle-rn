import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import FastImage from '@d11/react-native-fast-image';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useHeroStore } from '../../stores/hero.store';
import { useMediaStore } from '../../stores/media.store';
import { useUIStore } from '../../stores/ui.store';
import { useSelectionStore } from '../../stores/selection.store';
import { useShareStore } from '../../stores/share.store';
import { BasicNavigationProps } from '../../navigation/types.tsx';
import { LoadingContainer } from '../../components/ui/feedback/LoadingContainer';
import { ScreenContainer } from '../../components/ui/layout/ScreenContainer';
import { ContentContainer } from '../../components/ui/layout/ContentContainer.tsx';
import { ApiErrorFallback } from '../../components/ui/feedback/ApiErrorFallback';
import { useHeroPhotos } from '../../service/gallery/gallery.query.hook.ts';
import { useUploadGalleryV2 } from '../../service/gallery/gallery.upload.hook.ts';
import Gallery from './components/gallery/Gallery.tsx';
import GalleryBottomButton from './components/gallery/GalleryBottomButton.tsx';
import HeroSection from './components/hero/HeroSection.tsx';
import BottomSheetSection from './components/bottom-sheet/BottomSheetSection.tsx';
import { GalleryType } from '../../types/core/media.type.ts';
import { useAuthStore } from '../../stores/auth.store';

const HomePage = (): React.ReactElement => {
  // React hooks
  const [heroShareModalOpen, setHeroShareModalOpen] = useState<boolean>(false);
  const [receivedImageBottomSheetOpen, setReceivedImageBottomSheetOpen] =
    useState<boolean>(false);
  const [mediaPickerBottomSheetOpen, setMediaPickerBottomSheetOpen] =
    useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [scrollY, setScrollY] = useState<number>(0);
  const [isHeroCollapsed, setIsHeroCollapsed] = useState<boolean>(false);

  // 글로벌 상태 관리 (Zustand)
  const hero = useHeroStore(state => state.currentHero);
  const ageGroups = useMediaStore(state => state.ageGroups);
  const gallery = useMediaStore(state => state.gallery);
  const tags = useMediaStore(state => state.tags);
  const selectedTag = useSelectionStore(state => state.selectedTag);
  const setCurrentGalleryIndex = useSelectionStore(
    state => state.setCurrentGalleryIndex,
  );
  const setSelectedTag = useSelectionStore(state => state.setSelectedTag);
  const isGalleryUploading = useUIStore(state => state.uploadState.gallery);
  const sharedImageData = useShareStore(state => state.sharedImageData);
  const isLoggedIn = useAuthStore(state => state.isLoggedIn());

  // 외부 hook 호출 (navigation, route 등)
  const navigation = useNavigation<BasicNavigationProps>();

  // Custom hooks
  const { isLoading, isError, hasInitialData, refetch } = useHeroPhotos();
  const [submitGallery] = useUploadGalleryV2();

  // Custom functions (핸들러, 로직 함수 등)
  const handleHeroSharePress = useCallback(() => {
    setHeroShareModalOpen(true);
  }, []);

  const handleCloseHeroShareModal = useCallback(() => {
    setHeroShareModalOpen(false);
  }, []);

  const handleCloseReceivedImageBottomSheet = useCallback(() => {
    setReceivedImageBottomSheetOpen(false);
  }, []);

  const handleCloseMediaPicker = useCallback(() => {
    setMediaPickerBottomSheetOpen(false);
  }, []);

  const handleRefetch = useCallback(() => {
    if (refetch && hero?.id && hero.id >= 0) {
      refetch({
        params: {
          heroNo: hero.id,
        },
      });
    }
  }, [refetch, hero?.id]);

  const handlePullToRefresh = useCallback(() => {
    if (!isRefreshing && scrollY <= 0) {
      setIsRefreshing(true);
      if (refetch && hero?.id && hero.id >= 0) {
        refetch({
          params: {
            heroNo: hero.id,
          },
        });
      }
    }
  }, [refetch, hero?.id, isRefreshing, scrollY]);

  const handleGalleryItemPress = useCallback(
    (galleryItem: GalleryType) => {
      const allGallery = gallery ?? [];
      const allGalleryIndex = allGallery.findIndex(
        item => item.id === galleryItem.id,
      );

      setCurrentGalleryIndex(allGalleryIndex !== -1 ? allGalleryIndex : 0);

      navigation.navigate('App', {
        screen: 'StoryViewNavigator',
        params: {
          screen: isLoggedIn ? 'Story' : 'StoryDetailWithoutLogin',
        },
      });
    },
    [gallery, isLoggedIn, navigation, setCurrentGalleryIndex],
  );

  const handleGalleryButtonPress = useCallback(() => {
    if (selectedTag?.key === 'AI_PHOTO') {
      navigation.navigate('App', {
        screen: 'AiPhotoNavigator',
        params: {
          screen: 'AiPhotoWorkHistory',
        },
      });
    } else {
      setMediaPickerBottomSheetOpen(true);
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
    setIsHeroCollapsed(offsetY > 20);
  }, []);

  // Memoized default values for Gallery props
  const galleryAgeGroups = useMemo(() => ageGroups || {}, [ageGroups]);
  const galleryTags = useMemo(() => {
    if (!tags) return [];
    return tags;
  }, [tags]);

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
      !receivedImageBottomSheetOpen
    ) {
      setReceivedImageBottomSheetOpen(true);
    }
  }, [
    sharedImageData?.type,
    hero?.name,
    selectedTag?.key,
    receivedImageBottomSheetOpen,
  ]);

  useEffect(() => {
    if (!galleryTags.length) {
      return;
    }

    const isSelectedValid = galleryTags.some(
      tag => tag.key === selectedTag?.key,
    );
    if (!isSelectedValid) {
      setSelectedTag({ ...galleryTags[0] });
    }
  }, [galleryTags, selectedTag?.key, setSelectedTag]);

  useEffect(() => {
    if (!isLoading && isRefreshing) {
      setIsRefreshing(false);
    }
  }, [isLoading, isRefreshing]);

  // Close all bottom sheets when navigating away from this screen
  useFocusEffect(
    useCallback(() => {
      return () => {
        setHeroShareModalOpen(false);
        setReceivedImageBottomSheetOpen(false);
        setMediaPickerBottomSheetOpen(false);
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
    <LoadingContainer isLoading={isLoading || isGalleryUploading}>
      <ScreenContainer
        gap={0}
        alignItems="stretch"
        edges={['left', 'right', 'bottom']}
      >
        <ContentContainer flex={1} gap={12}>
          {/* 상단 프로필 영역 */}
          <HeroSection
            onSharePress={handleHeroSharePress}
            isCollapsed={isHeroCollapsed}
          />

          {/* 중간 사진 영역 */}
          <ContentContainer flex={1}>
            <Gallery
              ageGroups={galleryAgeGroups}
              tags={galleryTags}
              isError={isError}
              hasInitialData={hasInitialData}
              onRetry={handleRefetch}
              onScrollYChange={handleGalleryScrollYChange}
              isRefreshing={isRefreshing}
              onRefresh={handlePullToRefresh}
              onItemPress={handleGalleryItemPress}
            />
          </ContentContainer>
        </ContentContainer>

        {/* 하단 버튼 영역 */}
        {hero && hero.auth !== 'VIEWER' && (
          <GalleryBottomButton onPress={handleGalleryButtonPress} />
        )}
      </ScreenContainer>

      {/* 바텀 시트 영역 */}
      <BottomSheetSection
        heroShareModalOpen={heroShareModalOpen}
        onCloseHeroShareModal={handleCloseHeroShareModal}
        receivedImageBottomSheetOpen={receivedImageBottomSheetOpen}
        onCloseReceivedImageBottomSheet={handleCloseReceivedImageBottomSheet}
        mediaPickerBottomSheetOpen={mediaPickerBottomSheetOpen}
        onCloseMediaPicker={handleCloseMediaPicker}
        isGalleryUploading={isGalleryUploading}
        onSubmitGallery={submitGallery}
        onRefetch={handleRefetch}
      />
    </LoadingContainer>
  );
};

export default HomePage;
