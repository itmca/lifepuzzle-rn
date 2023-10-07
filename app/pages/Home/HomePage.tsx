import React, {useRef, useState} from 'react';
import StoryList from './StoryList';
import HeroStoryOverview from './HeroStoryOverview';
import {useRecoilValue, useResetRecoilState, useSetRecoilState} from 'recoil';
import {heroState} from '../../recoils/hero.recoil';
import {HeroType} from '../../types/hero.type';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {useStories} from '../../service/hooks/story.query.hook';
import {NoOutLineFullScreenContainer} from '../../components/styled/container/ScreenContainer';
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
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';
import {isLoggedInState} from '../../recoils/auth.recoil';
import {DUMMY_STORY_LIST} from '../../constants/dummy-story-list.constant';
import {SelectedStoryKeyState} from '../../recoils/story-view.recoil';
import {writingStoryState} from '../../recoils/story-write.recoil';

const HomePage = (): JSX.Element => {
  const hero = useRecoilValue<HeroType>(heroState);
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const setSelectedStoryKey = useSetRecoilState(SelectedStoryKeyState);
  const resetWritingStory = useResetRecoilState(writingStoryState);

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

  const navigation = useNavigation<BasicNavigationProps>();
  const scrollRef = useRef<ScrollView>(null);
  const [scrollPositionY, setScrollPositionY] = useState<number>(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const positionY = event.nativeEvent.contentOffset.y;
    setScrollPositionY(positionY);
  };

  return (
    <LoadingContainer isLoading={isLoading}>
      <NoOutLineFullScreenContainer>
        <ScrollView
          ref={scrollRef}
          onScroll={handleScroll}
          scrollEventThrottle={100}
          showsVerticalScrollIndicator={false}>
          <HeroStoryOverview hero={hero} />
          <View style={styles.customDivider} />
          <StoryList stories={displayStories} />
        </ScrollView>
        <GoToTopButton
          visible={scrollPositionY > 10}
          onPress={() => scrollRef.current?.scrollTo({y: 0})}
        />
        <WritingButton
          onPress={() => {
            setSelectedStoryKey('');
            resetWritingStory();

            navigation.push('NoTab', {
              screen: 'StoryWritingNavigator',
              params: {
                screen: 'StoryWritingQuestion',
              },
            });
          }}
        />
      </NoOutLineFullScreenContainer>
    </LoadingContainer>
  );
};

export default HomePage;
