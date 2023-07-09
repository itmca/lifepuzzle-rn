import React from 'react';
import {View} from 'react-native';
import {styles} from '../../pages/StoryList/styles';
import StoryItem from './StoryItem';
import {StoryType} from '../../types/story.type';
import Text from '../styled/components/Text';

type Props = {
  stories: StoryType[];
};

const StoryList = ({stories}: Props): JSX.Element => {
  return (
    <View style={styles.storyListContainer}>
      <Text style={styles.storyListTitle}>나의 조각</Text>
      {stories.map((story: StoryType) => (
        <StoryItem key={story.id} story={story} />
      ))}
    </View>
  );
};

export default StoryList;
