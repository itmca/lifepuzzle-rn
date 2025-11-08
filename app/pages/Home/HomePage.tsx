import {useRecoilState, useRecoilValue} from 'recoil';
import {heroState} from '../../recoils/hero.recoil';
import {HeroType} from '../../types/hero.type';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {ContentContainer} from '../../components/styled/container/ContentContainer.tsx';
import HeroOverview from './HeroOverview.tsx';
import {useHeroPhotos} from '../../service/hooks/photo.query.hook.ts';
import {
  ageGroupsState,
  selectedTagState,
  tagState,
} from '../../recoils/photos.recoil.ts';
import {AgeGroupsType, SharePhoto, TagType} from '../../types/photo.type.ts';
import Gallery from './Gallery.tsx';
import {useFocusAction} from '../../service/hooks/screen.hook.ts';
import React, {useCallback, useEffect, useState} from 'react';
import {ShareButton} from '../../components/button/ShareButton.tsx';
import FastImage from 'react-native-fast-image';
import {Keyboard} from 'react-native';
import BottomSheet from '../../components/styled/components/BottomSheet.tsx';
import {ShareAuthList} from '../../components/hero/ShareAuthList.tsx';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {isGalleryUploadingState} from '../../recoils/gallery-write.recoil.ts';
import {useUploadGalleryV2} from '../../service/hooks/gallery.upload.hook.ts';
import {sharedImageDataState} from '../../recoils/share.recoil';
import GalleryBottomButton from './GalleryBottomButton.tsx';
import {SharedBottomSheet} from './SharedBottomSheet.tsx';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types.tsx';
import {MediaPickerBottomSheet} from './MediaPickerBottomSheet.tsx';

const HomePage = (): JSX.Element => {
  // React hooks
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [shareBottomSheetOpen, setShareBottomSheetOpen] =
    useState<boolean>(false);
  const [mediaPickerBottomSheetOpen, setMediaPickerBottomSheetOpen] =
    useState<boolean>(false);

  // 글로벌 상태 관리 (Recoil)
  const hero = useRecoilValue<HeroType>(heroState);
  const [ageGroups] = useRecoilState<AgeGroupsType>(ageGroupsState);
  const [tags] = useRecoilState<TagType[]>(tagState);
  const selectedTag = useRecoilValue<TagType>(selectedTagState);
  const isGalleryUploading = useRecoilValue<boolean>(isGalleryUploadingState);
  const [sharedImageData, setSharedImageData] =
    useRecoilState(sharedImageDataState);

  // 외부 hook 호출 (navigation, route 등)
  const navigation = useNavigation<BasicNavigationProps>();

  // Custom hooks
  const {photoHero, isLoading, refetch} = useHeroPhotos();
  const [submitGallery] = useUploadGalleryV2();

  // Custom functions (핸들러, 로직 함수 등)
  const handlePresentModalPress = useCallback(() => {
    Keyboard.dismiss();
    setOpenModal(true);
  }, []);

  // Side effects (useEffect 등)
  useEffect(() => {
    if (ageGroups && Object.keys(ageGroups).length > 0) {
      const imageUrls = Object.values(ageGroups).flatMap(ageGroup =>
        ageGroup.gallery.map(photo => ({uri: photo.url})),
      );

      if (imageUrls.length > 0) {
        FastImage.preload(imageUrls);
      }
    }
  }, [ageGroups]);

  useFocusAction(() => {
    if (!refetch || hero.heroNo < 0) {
      return;
    }
    refetch({
      params: {
        heroNo: hero.heroNo,
      },
    });
  });

  useEffect(() => {
    if (sharedImageData && sharedImageData.type) {
      if (!hero || !hero.heroName || !selectedTag) {
        return;
      }
      setShareBottomSheetOpen(true);
    }
  }, [sharedImageData, hero, selectedTag]);

  return (
    <LoadingContainer isLoading={isLoading || isGalleryUploading}>
      <BottomSheetModalProvider>
        <ScreenContainer gap={0}>
          {/* 상단 프로필 영역 */}
          <ContentContainer withScreenPadding useHorizontalLayout>
            {photoHero && (
              <>
                <HeroOverview hero={photoHero} />
                {(hero.auth === 'OWNER' || hero.auth === 'ADMIN') && (
                  <ContentContainer width={'auto'}>
                    <ShareButton onPress={handlePresentModalPress} />
                  </ContentContainer>
                )}
              </>
            )}
          </ContentContainer>
          {/* 중간 사진 영역 */}
          <ContentContainer flex={1}>
            <Gallery hero={photoHero} ageGroups={ageGroups} tags={tags} />
          </ContentContainer>
          {/* 하단 버튼 영역 */}
          {hero.auth !== 'VIEWER' && (
            <GalleryBottomButton
              onPress={() => {
                if (selectedTag.key === 'AI_PHOTO') {
                  navigation.push('NoTab', {
                    screen: 'AiPhotoNavigator',
                    params: {
                      screen: 'AiPhotoWorkHistory',
                    },
                  });
                } else {
                  setMediaPickerBottomSheetOpen(true);
                }
              }}
            />
          )}
        </ScreenContainer>
        {/* 바텀 시트 영역 */}
        <BottomSheet
          opened={openModal}
          title={'공유하기'}
          onClose={() => {
            setOpenModal(false);
          }}>
          <ShareAuthList />
        </BottomSheet>

        <SharedBottomSheet
          visible={shareBottomSheetOpen}
          sharedImageData={sharedImageData}
          onClose={() => {
            setShareBottomSheetOpen(false);
            setSharedImageData({} as SharePhoto);
            refetch({
              params: {
                heroNo: hero.heroNo,
              },
            });
          }}
          isGalleryUploading={isGalleryUploading}
        />

        <MediaPickerBottomSheet
          visible={mediaPickerBottomSheetOpen}
          onClose={() => setMediaPickerBottomSheetOpen(false)}
          onSubmitGallery={submitGallery}
          isGalleryUploading={isGalleryUploading}
        />
      </BottomSheetModalProvider>
    </LoadingContainer>
  );
};

export default HomePage;
