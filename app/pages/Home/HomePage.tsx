import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import {heroState} from '../../recoils/hero.recoil';
import {HeroType} from '../../types/hero.type';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {WritingButton} from './WritingButton';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';
import {SelectedStoryKeyState} from '../../recoils/story-view.recoil';
import {
  PostStoryKeyState,
  writingStoryState,
} from '../../recoils/story-write.recoil';
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
import {useCallback, useEffect, useState} from 'react';
import {ShareButton} from '../../components/button/ShareButton.tsx';
import {Keyboard} from 'react-native';
import BottomSheet from '../../components/styled/components/BottomSheet.tsx';
import {ShareAuthList} from '../../components/hero/ShareAuthList.tsx';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import React from 'react';
import {selectedGalleryItemsState} from '../../recoils/gallery-write.recoil.ts';
import {useUploadGallery} from '../../service/hooks/gallery.write.hook.ts';
import {BodyTextM, Title} from '../../components/styled/components/Text.tsx';
import {sharedImageDataState} from '../../recoils/share.recoil';
import {BasicButton} from '../../components/button/BasicButton.tsx';
import {LargeImage} from '../../components/styled/components/Image.tsx';

const HomePage = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();

  const hero = useRecoilValue<HeroType>(heroState);
  const setSelectedStoryKey = useSetRecoilState(SelectedStoryKeyState);
  const resetWritingStory = useResetRecoilState(writingStoryState);
  const setPostStoryKey = useSetRecoilState(PostStoryKeyState);

  const {photoHero, isLoading, refetch} = useHeroPhotos();
  const [ageGroups] = useRecoilState<AgeGroupsType>(ageGroupsState);
  const [tags] = useRecoilState<TagType[]>(tagState);
  //bottom sheet
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [shareBottomSheetOpen, setShareBottomSheetOpen] =
    useState<boolean>(false);
  const [sharedImageData, setSharedImageData] =
    useRecoilState(sharedImageDataState);

  const handlePresentModalPress = useCallback(() => {
    Keyboard.dismiss();
    setOpenModal(true);
  }, []);

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
  const [submitGallery, isGalleryUploading] = useUploadGallery();
  const setSelectedGalleryItems = useSetRecoilState(selectedGalleryItemsState);

  const uploadSharedImages = React.useCallback(
    (uris: string | string[]) => {
      try {
        const photoIdentifiers = Array.isArray(uris)
          ? uris.map((uri, index) => createPhotoIdentifier(uri, index))
          : [createPhotoIdentifier(uris, 0)];

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

  const createPhotoIdentifier = (uri: string, index: number) => ({
    node: {
      id: `shared_image_${Date.now()}_${index}`,
      image: {
        uri: uri,
        filename: `shared_image_${Date.now()}_${index}.jpg`,
        width: 0,
        height: 0,
      },
      type: 'image',
      timestamp: Date.now() / 1000,
    },
  });

  return (
    <LoadingContainer isLoading={isLoading}>
      <BottomSheetModalProvider>
        <ScreenContainer gap={0}>
          <ContentContainer withScreenPadding useHorizontalLayout>
            {photoHero && (
              <>
                <HeroOverview hero={photoHero} />
                {hero.auth === 'OWNER' && (
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
            <ContentContainer
              paddingHorizontal={20}
              paddingBottom={37}
              backgroundColor="transparent">
              <WritingButton
                onPress={() => {
                  setSelectedStoryKey('');
                  setPostStoryKey('');
                  resetWritingStory();

                  navigation.push('NoTab', {
                    screen: 'StoryWritingNavigator',
                    params: {
                      screen: 'StoryGallerySelector',
                    },
                  });
                }}
              />
            </ContentContainer>
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
      </BottomSheetModalProvider>
    </LoadingContainer>
  );
};

export default HomePage;
