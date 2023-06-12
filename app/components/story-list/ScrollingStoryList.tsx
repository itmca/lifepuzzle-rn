import React, {useRef, useState} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {styles} from '../../pages/StoryList/styles';
import StoryItem from './StoryItem';
import {StoryType} from '../../types/story.type';
import {GoToTopButton} from '../button/GoToTopButton';

type Props = {
  stories: StoryType[];
};

const ScrollingStoryList = ({stories}: Props): JSX.Element => {
  const [scrollPositionY, setScrollPositionY] = useState<number>(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const positionY = event.nativeEvent.contentOffset.y;
    setScrollPositionY(positionY);
  };

  const scrollRef = useRef<ScrollView>(null);

  return (
    <SafeAreaView style={styles.scrollViewContainer}>
      <ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={100}
        showsVerticalScrollIndicator={false}>
        {stories.map((story: StoryType) => (
          <StoryItem key={story.id} story={story} />
        ))}
      </ScrollView>
      <GoToTopButton
        visible={scrollPositionY > 10}
        onPress={() => scrollRef.current?.scrollTo({y: 0})}
      />
    </SafeAreaView>
  );
};

export default ScrollingStoryList;
