import React from 'react';
import {StyleSheet, View} from 'react-native';
import StoryItem from './StoryItem';
import {StoryType} from '../../types/story.type';
import {LargeText} from '../styled/components/Text';

type Props = {
  stories: StoryType[];
};

const styles = StyleSheet.create({
  storyListContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    height: '100%',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 16,
  },
  storyListTitle: {
    marginTop: 8,
    marginLeft: 5,
  },
});

const StoryList = ({stories}: Props): JSX.Element => {
  return (
    <View style={styles.storyListContainer}>
      <LargeText style={styles.storyListTitle} fontWeight={700}>
        나의 조각
      </LargeText>
      {stories.map((story: StoryType) => (
        <StoryItem key={story.id} story={story} />
      ))}
    </View>
  );
};

export default StoryList;
