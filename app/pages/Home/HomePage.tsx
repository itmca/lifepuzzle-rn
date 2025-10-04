import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {heroState} from '../../recoils/hero.recoil';
import {HeroType} from '../../types/hero.type';
import {toPhotoIdentifier} from '../../service/photo-identifier.service';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {WritingButton} from './WritingButton';
import {ContentContainer} from '../../components/styled/container/ContentContainer.tsx';
import HeroOverview from './HeroOverview.tsx';
import {useHeroPhotos} from '../../service/hooks/photo.query.hook.ts';
import {
  ageGroupsState,
  selectedTagState,
  tagState,
} from '../../recoils/photos.recoil.ts';
import {AgeGroupsType, TagType} from '../../types/photo.type.ts';
import Gallery from './Gallery.tsx';
import {useFocusAction} from '../../service/hooks/screen.hook.ts';
import React, {useCallback, useEffect, useState} from 'react';
import {ShareButton} from '../../components/button/ShareButton.tsx';
import FastImage from 'react-native-fast-image';
import {Keyboard} from 'react-native';
import BottomSheet from '../../components/styled/components/BottomSheet.tsx';
import {ShareAuthList} from '../../components/hero/ShareAuthList.tsx';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {
  isGalleryUploadingState,
  selectedGalleryItemsState,
} from '../../recoils/gallery-write.recoil.ts';
import {useUploadGalleryV2} from '../../service/hooks/gallery.upload.hook.ts';
import {BodyTextM, Title} from '../../components/styled/components/Text.tsx';
import {sharedImageDataState} from '../../recoils/share.recoil';
import {BasicButton} from '../../components/button/BasicButton.tsx';
import {LargeImage} from '../../components/styled/components/Image.tsx';
import GalleryBottomButton from './GalleryBottomButton.tsx';
import {MediaPickerBottomSheet} from './MediaPickerBottomSheet.tsx';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types.tsx';

const HomePage = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  const hero = useRecoilValue<HeroType>(heroState);

  const {photoHero, isLoading, refetch} = useHeroPhotos();
  const [ageGroups] = useRecoilState<AgeGroupsType>(ageGroupsState);
  const [tags] = useRecoilState<TagType[]>(tagState);
  //bottom sheet
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [shareBottomSheetOpen, setShareBottomSheetOpen] =
    useState<boolean>(false);
  const [mediaPickerBottomSheetOpen, setMediaPickerBottomSheetOpen] =
    useState<boolean>(false);
  const [sharedImageData, setSharedImageData] =
    useRecoilState(sharedImageDataState);

  const handlePresentModalPress = useCallback(() => {
    Keyboard.dismiss();
    setOpenModal(true);
  }, []);

  // 이미지 프리로드
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
        console.log('⚠️ Hero or selectedTag not ready yet');
        return;
      }
      setShareBottomSheetOpen(true);
    }
  }, [sharedImageData, hero, selectedTag]);

  const selectedTag = useRecoilValue<TagType>(selectedTagState);
  const isGalleryUploading = useRecoilValue<boolean>(isGalleryUploadingState);
  const [submitGallery] = useUploadGalleryV2();
  const setSelectedGalleryItems = useSetRecoilState(selectedGalleryItemsState);

  const uploadSharedImages = React.useCallback(
    (uris: string | string[]) => {
      try {
        const photoIdentifiers = Array.isArray(uris)
          ? uris.map((uri, index) => toPhotoIdentifier(uri))
          : [toPhotoIdentifier(uris)];

        setSelectedGalleryItems(photoIdentifiers);
        submitGallery();

        // BottomSheet 닫기
        setShareBottomSheetOpen(false);
        setSharedImageData(null);
      } catch (error) {
        console.error('Error uploading shared images:', error);
      }
    },
    [setSelectedGalleryItems, submitGallery],
  );

  return (
    <LoadingContainer isLoading={isLoading || isGalleryUploading}>
      <BottomSheetModalProvider>
        <ScreenContainer gap={0}>
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
          <ContentContainer flex={1}>
            <Gallery hero={photoHero} ageGroups={ageGroups} tags={tags} />
          </ContentContainer>
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
        <BottomSheet
          opened={openModal}
          title={'공유하기'}
          onClose={() => {
            setOpenModal(false);
          }}>
          <ShareAuthList />
        </BottomSheet>

        <BottomSheet
          opened={shareBottomSheetOpen}
          title={'공유된 이미지 업로드'}
          onClose={() => {
            setShareBottomSheetOpen(false);
            setSharedImageData(null);
          }}>
          {sharedImageData && (
            <ContentContainer>
              <Title>공유된 이미지를 업로드하시겠습니까?</Title>
              <ContentContainer useHorizontalLayout>
                <LargeImage
                  source={{
                    uri: sharedImageData.uri,
                  }}
                />
                <ContentContainer>
                  <BodyTextM>주인공: {hero?.heroName}</BodyTextM>
                  <BodyTextM>나이대: {selectedTag?.label}</BodyTextM>
                  {sharedImageData.type === 'multiple' &&
                    sharedImageData.uriList && (
                      <BodyTextM>
                        이미지 개수: {sharedImageData.uriList.length}개
                      </BodyTextM>
                    )}
                </ContentContainer>
              </ContentContainer>
              <BasicButton
                onPress={() => {
                  if (sharedImageData.type === 'single') {
                    uploadSharedImages(sharedImageData.uri);
                  } else if (sharedImageData.type === 'multiple') {
                    uploadSharedImages(sharedImageData.uriList);
                  }
                }}
                text="업로드"
              />
            </ContentContainer>
          )}
        </BottomSheet>

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
