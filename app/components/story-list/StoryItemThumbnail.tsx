import React from 'react';
import {Dimensions, View} from 'react-native';
import {StoryType} from '../../types/story.type';
import {styles} from './styles';
import StoryMediaCarousel from '../story/StoryMediaCarousel';

type props = {
  story: StoryType;
};

export const Thumbnail = ({story}: props): JSX.Element => {
  return (
    <View style={styles.thumbnailContainer}>
      <StoryMediaCarousel
        carouselWidth={Dimensions.get('window').width - 34}
        story={story}
      />
    </View>
  );
};
