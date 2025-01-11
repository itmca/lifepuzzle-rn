import {useRecoilValue, useResetRecoilState, useSetRecoilState} from 'recoil';
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
import {
  DUMMY_AGE_GROUPS,
  DUMMY_TAGS,
} from '../../constants/dummy-age-group.constant.ts';
import {selectedTagState} from '../../recoils/photos.recoil.ts';
import {TagType} from '../../types/photo.type.ts';
import Gallery from './Gallery.tsx';
import {useLoginAlert} from '../../service/hooks/login.hook.ts';
import {useFocusAction} from '../../service/hooks/screen.hook.ts';

const HomePage = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();

  const hero = useRecoilValue<HeroType>(heroState);
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const setSelectedStoryKey = useSetRecoilState(SelectedStoryKeyState);
  const resetWritingStory = useResetRecoilState(writingStoryState);
  const setPostStoryKey = useSetRecoilState(PostStoryKeyState);
  const loginAlert = useLoginAlert();

  const selectedTag = useRecoilValue<TagType>(selectedTagState);
  const {photoHero, ageGroups, tags, isLoading, refetch} = useHeroPhotos();
  const displayAgeGroups = isLoggedIn ? ageGroups : DUMMY_AGE_GROUPS;
  const displayTags = isLoggedIn ? tags : DUMMY_TAGS;

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
      <ScreenContainer gap={0}>
        <ContentContainer withScreenPadding>
          <HeroOverview hero={photoHero} />
        </ContentContainer>
        <ContentContainer flex={1}>
          <Gallery
            hero={photoHero}
            ageGroups={displayAgeGroups}
            tags={displayTags}
          />
        </ContentContainer>
        {hero.auth !== 'VIEWER' && (
          <ContentContainer withScreenPadding backgroundColor="transparent">
            <WritingButton
              tagLabel={selectedTag?.label ?? ''}
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
    </LoadingContainer>
  );
};

export default HomePage;
