import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';

import FastImage from '@d11/react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
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
import { useHeroPhotos } from '../../service/gallery/photo.query.hook.ts';
import { useUploadGalleryV2 } from '../../service/gallery/gallery.upload.hook.ts';
import Gallery from './components/Gallery/Gallery.tsx';
import GalleryBottomButton from './components/Gallery/GalleryBottomButton.tsx';
import HeroSection from './components/Hero/HeroSection.tsx';
import BottomSheetSection from './components/BottomSheet/BottomSheetSection.tsx';

const HomePage = (): React.ReactElement => {
  // React hooks
  const [heroShareModalOpen, setHeroShareModalOpen] = useState<boolean>(false);
  const [receivedImageBottomSheetOpen, setReceivedImageBottomSheetOpen] =
    useState<boolean>(false);
  const [mediaPickerBottomSheetOpen, setMediaPickerBottomSheetOpen] =
    useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [scrollY, setScrollY] = useState<number>(0);

  // 글로벌 상태 관리 (Zustand)
  const hero = useHeroStore(state => state.currentHero);
  const ageGroups = useMediaStore(state => state.ageGroups);
  const tags = useMediaStore(state => state.tags);
  const selectedTag = useSelectionStore(state => state.selectedTag);
  const isGalleryUploading = useUIStore(state => state.uploadState.gallery);
  const sharedImageData = useShareStore(state => state.sharedImageData);

  // 외부 hook 호출 (navigation, route 등)
  const navigation = useNavigation<BasicNavigationProps>();

  // Custom hooks
  const { photoHero, isLoading, isError, hasInitialData, refetch } =
    useHeroPhotos();
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
    if (refetch && hero?.heroNo && hero.heroNo >= 0) {
      refetch({
        params: {
          heroNo: hero.heroNo,
        },
      });
    }
  }, [refetch, hero?.heroNo]);

  const handlePullToRefresh = useCallback(() => {
    if (!isRefreshing && scrollY <= 0) {
      setIsRefreshing(true);
      if (refetch && hero?.heroNo && hero.heroNo >= 0) {
        refetch({
          params: {
            heroNo: hero.heroNo,
          },
        });
      }
    }
  }, [refetch, hero?.heroNo, isRefreshing, scrollY]);

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

  // Side effects (useEffect 등)
  useEffect(() => {
    if (imageUrls.length > 0) {
      FastImage.preload(imageUrls);
    }
  }, [imageUrls]);

  useEffect(() => {
    if (
      sharedImageData?.type &&
      hero?.heroName &&
      selectedTag?.key &&
      !receivedImageBottomSheetOpen
    ) {
      setReceivedImageBottomSheetOpen(true);
    }
  }, [
    sharedImageData?.type,
    hero?.heroName,
    selectedTag?.key,
    receivedImageBottomSheetOpen,
  ]);

  useEffect(() => {
    if (!isLoading && isRefreshing) {
      setIsRefreshing(false);
    }
  }, [isLoading, isRefreshing]);

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
      <BottomSheetModalProvider>
        <ScreenContainer gap={0} alignItems="stretch">
          <ScrollView
            style={{ flex: 1, width: '100%' }}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            onScroll={event => {
              setScrollY(event.nativeEvent.contentOffset.y);
            }}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handlePullToRefresh}
                progressBackgroundColor="#ffffff"
                colors={['#007AFF']}
                tintColor="#007AFF"
              />
            }
          >
            {/* 상단 프로필 영역 */}
            <HeroSection
              photoHero={photoHero}
              onSharePress={handleHeroSharePress}
            />

            {/* 중간 사진 영역 */}
            <ContentContainer flex={1}>
              <Gallery
                hero={photoHero}
                ageGroups={ageGroups || {}}
                tags={tags || []}
                isError={isError}
                hasInitialData={hasInitialData}
                onRetry={handleRefetch}
              />
            </ContentContainer>
          </ScrollView>

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
      </BottomSheetModalProvider>
    </LoadingContainer>
  );
};

export default HomePage;
