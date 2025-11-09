import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useRecoilState, useRecoilValue} from 'recoil';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {heroState} from '../../recoils/hero.recoil';
import {
  ageGroupsState,
  selectedTagState,
  tagState,
} from '../../recoils/photos.recoil.ts';
import {isGalleryUploadingState} from '../../recoils/gallery-write.recoil.ts';
import {sharedImageDataState} from '../../recoils/share.recoil';
import {HeroType} from '../../types/hero.type';
import {AgeGroupsType, TagType} from '../../types/photo.type.ts';
import {BasicNavigationProps} from '../../navigation/types.tsx';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {ContentContainer} from '../../components/styled/container/ContentContainer.tsx';
import {useHeroPhotos} from '../../service/hooks/photo.query.hook.ts';
import {useFocusAction} from '../../service/hooks/screen.hook.ts';
import {useUploadGalleryV2} from '../../service/hooks/gallery.upload.hook.ts';
import Gallery from './components/Gallery/Gallery.tsx';
import GalleryBottomButton from './components/Gallery/GalleryBottomButton.tsx';
import HeroSection from './components/Hero/HeroSection.tsx';
import BottomSheetSection from './components/BottomSheet/BottomSheetSection.tsx';

const HomePage = (): JSX.Element => {
  // React hooks
  const [heroShareModalOpen, setHeroShareModalOpen] = useState<boolean>(false);
  const [receivedImageBottomSheetOpen, setReceivedImageBottomSheetOpen] =
    useState<boolean>(false);
  const [mediaPickerBottomSheetOpen, setMediaPickerBottomSheetOpen] =
    useState<boolean>(false);

  // 글로벌 상태 관리 (Recoil)
  const hero = useRecoilValue<HeroType>(heroState);
  const [ageGroups] = useRecoilState<AgeGroupsType>(ageGroupsState);
  const [tags] = useRecoilState<TagType[]>(tagState);
  const selectedTag = useRecoilValue<TagType>(selectedTagState);
  const isGalleryUploading = useRecoilValue<boolean>(isGalleryUploadingState);
  const sharedImageData = useRecoilValue(sharedImageDataState);

  // 외부 hook 호출 (navigation, route 등)
  const navigation = useNavigation<BasicNavigationProps>();

  // Custom hooks
  const {photoHero, isLoading, isError, hasInitialData, refetch} =
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

  const handleGalleryButtonPress = useCallback(() => {
    if (selectedTag?.key === 'AI_PHOTO') {
      navigation.push('NoTab', {
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
      ageGroup.gallery.map(photo => ({uri: photo.url})),
    );
  }, [ageGroups]);

  // Side effects (useEffect 등)
  useEffect(() => {
    if (imageUrls.length > 0) {
      FastImage.preload(imageUrls);
    }
  }, [imageUrls]);

  useFocusAction(handleRefetch);

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

  return (
    <LoadingContainer isLoading={isLoading || isGalleryUploading}>
      <BottomSheetModalProvider>
        <ScreenContainer gap={0}>
          {/* 상단 프로필 영역 */}
          <HeroSection
            photoHero={photoHero}
            onSharePress={handleHeroSharePress}
          />

          {/* 중간 사진 영역 */}
          <ContentContainer flex={1}>
            <Gallery
              hero={photoHero}
              ageGroups={ageGroups}
              tags={tags}
              isError={isError}
              hasInitialData={hasInitialData}
              onRetry={handleRefetch}
            />
          </ContentContainer>

          {/* 하단 버튼 영역 */}
          {hero.auth !== 'VIEWER' && (
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
