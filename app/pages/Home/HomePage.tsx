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
import {isLoggedInState} from '../../recoils/auth.recoil';
import {SelectedStoryKeyState} from '../../recoils/story-view.recoil';
import {
  PostStoryKeyState,
  writingStoryState,
} from '../../recoils/story-write.recoil';
import {ContentContainer} from '../../components/styled/container/ContentContainer.tsx';
import HeroOverview from './HeroOverview.tsx';
import {useHeroPhotos} from '../../service/hooks/photo.query.hook.ts';
import {ageGroupsState, tagState} from '../../recoils/photos.recoil.ts';
import {AgeGroupsType, TagType} from '../../types/photo.type.ts';
import Gallery from './Gallery.tsx';
import {useLoginAlert} from '../../service/hooks/login.hook.ts';
import {useFocusAction} from '../../service/hooks/screen.hook.ts';
import {useCallback, useMemo, useState} from 'react';
import {ShareButton} from '../../components/button/ShareButton.tsx';
import {Keyboard} from 'react-native';
import BottomSheet from '../../components/styled/components/BottomSheet.tsx';
import {ShareAuthList} from '../../components/hero/ShareAuthList.tsx';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

const HomePage = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();

  const hero = useRecoilValue<HeroType>(heroState);
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const setSelectedStoryKey = useSetRecoilState(SelectedStoryKeyState);
  const resetWritingStory = useResetRecoilState(writingStoryState);
  const setPostStoryKey = useSetRecoilState(PostStoryKeyState);
  const loginAlert = useLoginAlert();

  const {photoHero, isLoading, refetch} = useHeroPhotos();
  const [ageGroups] = useRecoilState<AgeGroupsType>(ageGroupsState);
  const [tags] = useRecoilState<TagType[]>(tagState);
  //bottom sheet
  const [openModal, setOpenModal] = useState<boolean>(false);
  const handlePresentModalPress = useCallback(() => {
    Keyboard.dismiss();
    setOpenModal(true);
  }, []);
  useFocusAction(() => {
    if (!refetch) {
      return;
    }
    refetch({
      params: {
        heroNo: hero.heroNo,
      },
    });
  });

  return (
    <LoadingContainer isLoading={isLoading}>
      <BottomSheetModalProvider>
        <ScreenContainer gap={0}>
          <ContentContainer withScreenPadding useHorizontalLayout>
            <HeroOverview hero={photoHero} />
            {hero.auth === 'OWNER' && (
              <ContentContainer width={'auto'}>
                <ShareButton onPress={handlePresentModalPress}></ShareButton>
              </ContentContainer>
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
                  if (!isLoggedIn) {
                    loginAlert({
                      title:
                        '로그인 후 사랑하는 사람의 사진/동영상을 업로드해보세요',
                    });
                    return;
                  }

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
          snapPoints={useMemo(() => ['44%'], [])}
          onClose={() => {
            setOpenModal(false);
          }}>
          <ShareAuthList />
        </BottomSheet>
      </BottomSheetModalProvider>
    </LoadingContainer>
  );
};

export default HomePage;
