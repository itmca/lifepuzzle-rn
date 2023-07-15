import React, {useRef, useState} from 'react';
import StoryList from '../../components/story-list/StoryList';
import HeroStoryOverview from '../../components/story-list/HeroStoryOverview';
import {useRecoilValue} from 'recoil';
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
import {GoToTopButton} from '../../components/button/GoToTopButton';
import {WritingButton} from '../../components/button/WritingButton';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';

const StoryListPage = (): JSX.Element => {
  const hero = useRecoilValue<HeroType>(heroState);
  const {stories, isLoading} = useStories();

  const storyList = stories.map(story => {
    if (story.audios[0] !== undefined) {
      const audioSound = new Sound(story.audios[0], undefined, () => {
        story.recordingTime = toMinuteSeconds(audioSound.getDuration());
      });
    }
    return story;
  });

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
          <StoryList stories={storyList} />
        </ScrollView>
        <GoToTopButton
          visible={scrollPositionY > 10}
          onPress={() => scrollRef.current?.scrollTo({y: 0})}
        />
        <WritingButton
          onPress={() =>
            navigation.push('NoTab', {
              screen: 'PuzzleWritingNavigator',
              params: {
                screen: 'PuzzleWritingQuestion',
              },
            })
          }
        />
      </NoOutLineFullScreenContainer>
    </LoadingContainer>
  );
};

export default StoryListPage;
