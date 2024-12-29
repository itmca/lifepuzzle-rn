import {useRef, useState} from 'react';
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
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from 'react-native';
import {GoToTopButton} from './GoToTopButton';
import {WritingButton} from './WritingButton';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';
import {isLoggedInState} from '../../recoils/auth.recoil';
import {SelectedStoryKeyState} from '../../recoils/story-view.recoil';
import {
  PostStoryKeyState,
  writingStoryState,
} from '../../recoils/story-write.recoil';
import {ContentContainer} from '../../components/styled/container/ContentContainer.tsx';
import HeroOverview from './HeroOverview.tsx';
import {userState} from '../../recoils/user.recoil.ts';
import {useHeroPhotos} from '../../service/hooks/photo.query.hook.ts';
import {
  DUMMY_AGE_GROUPS,
  DUMMY_TAGS,
} from '../../constants/dummy-age-group.constant.ts';
import {
  ageGroupsState,
  selectedTagState,
  tagState,
} from '../../recoils/photos.recoil.ts';
import {AgeGroupsType, TagType} from '../../types/photo.type.ts';
import Gallery from './Gallery.tsx';

const HomePage = (): JSX.Element => {
  const isFocused = useIsFocused();
  const navigation = useNavigation<BasicNavigationProps>();

  const user = useRecoilValue(userState);
  const hero = useRecoilValue<HeroType>(heroState);
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const setSelectedStoryKey = useSetRecoilState(SelectedStoryKeyState);
  const resetWritingStory = useResetRecoilState(writingStoryState);
  const setPostStoryKey = useSetRecoilState(PostStoryKeyState);
  //const {stories, isLoading} = useStories();

  const [selectedTag, setSelectedTag] =
    useRecoilState<TagType>(selectedTagState);
  const [ageGroups, setAgeGroups] =
    useRecoilState<AgeGroupsType>(ageGroupsState);
  const [tags, setTags] = useRecoilState<TagType[]>(tagState);
  const {photoHero, isLoading} = useHeroPhotos();
  const displayAgeGroups = isLoggedIn ? ageGroups : DUMMY_AGE_GROUPS;
  const displayTags = isLoggedIn ? tags : DUMMY_TAGS;

  const scrollRef = useRef<ScrollView>(null);
  const [scrollPositionY, setScrollPositionY] = useState<number>(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const positionY = event.nativeEvent.contentOffset.y;
    setScrollPositionY(positionY);
  };

  return (
    <LoadingContainer isLoading={isLoading}>
      <ScreenContainer gap={0}>
        <ContentContainer withScreenPadding>
          <HeroOverview hero={photoHero} />
        </ContentContainer>
        <Gallery
          hero={photoHero}
          ageGroups={displayAgeGroups}
          tags={displayTags}></Gallery>
        <GoToTopButton
          visible={scrollPositionY > 10}
          onPress={() => scrollRef.current?.scrollTo({y: 0})}
        />
        {hero.auth !== 'VIEWER' && (
          <ContentContainer withScreenPadding backgroundColor="transparent">
            <WritingButton
              tagLabel={
                (selectedTag?.key === 'under10'
                  ? '10세 미만'
                  : selectedTag?.label) ?? ''
              }
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
    </LoadingContainer>
  );
};

export default HomePage;
