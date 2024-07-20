import React, {useRef, useState} from 'react';
import StoryList from './StoryList';
import {useRecoilValue, useResetRecoilState, useSetRecoilState} from 'recoil';
import {heroState} from '../../recoils/hero.recoil';
import {HeroType} from '../../types/hero.type';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {useStories} from '../../service/hooks/story.query.hook';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import Sound from 'react-native-sound';
import {toMinuteSeconds} from '../../service/time-display.service';
import {styles} from './styles';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from 'react-native';
import {GoToTopButton} from './GoToTopButton';
import {WritingButton} from './WritingButton';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';
import {isLoggedInState} from '../../recoils/auth.recoil';
import {DUMMY_STORY_LIST} from '../../constants/dummy-story-list.constant';
import {SelectedStoryKeyState} from '../../recoils/story-view.recoil';
import {
  PostStoryKeyState,
  writingStoryState,
} from '../../recoils/story-write.recoil';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../components/styled/container/ContentContainer.tsx';
import HeroOverview from './HeroOverview.tsx';

const HomePage = (): JSX.Element => {
  const isFocused = useIsFocused();
  const navigation = useNavigation<BasicNavigationProps>();

  const hero = useRecoilValue<HeroType>(heroState);
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const setSelectedStoryKey = useSetRecoilState(SelectedStoryKeyState);
  const resetWritingStory = useResetRecoilState(writingStoryState);
  const setPostStoryKey = useSetRecoilState(PostStoryKeyState);
  const {stories, isLoading} = useStories();

  const displayStories = (isLoggedIn ? stories : DUMMY_STORY_LIST).map(
    story => {
      if (story.audios[0] !== undefined) {
        const audioSound = new Sound(story.audios[0], undefined, () => {
          story.recordingTime = toMinuteSeconds(audioSound.getDuration());
        });
      }
      return story;
    },
  );

  const scrollRef = useRef<ScrollView>(null);
  const [scrollPositionY, setScrollPositionY] = useState<number>(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const positionY = event.nativeEvent.contentOffset.y;
    setScrollPositionY(positionY);
  };

  return (
    <LoadingContainer isLoading={isLoading}>
      <ScreenContainer gap={0}>
        <ScrollContentContainer
          withScreenPadding
          ref={scrollRef}
          onScroll={handleScroll}>
          <HeroOverview hero={hero} />
          <View style={styles.customDivider} />
          <StoryList stories={displayStories} isFocused={isFocused} />
        </ScrollContentContainer>
        <GoToTopButton
          visible={scrollPositionY > 10}
          onPress={() => scrollRef.current?.scrollTo({y: 0})}
        />
        <ContentContainer withScreenPadding paddingTop={8}>
          <WritingButton
            onPress={() => {
              setSelectedStoryKey('');
              setPostStoryKey('');

              resetWritingStory();

              navigation.push('NoTab', {
                screen: 'StoryWritingNavigator',
                params: {
                  screen: 'StoryWritingQuestion',
                },
              });
            }}
          />
        </ContentContainer>
      </ScreenContainer>
    </LoadingContainer>
  );
};

export default HomePage;
