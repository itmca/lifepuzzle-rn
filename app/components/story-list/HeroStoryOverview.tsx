import React from 'react';
import {View} from 'react-native';
import HeroOverview from './HeroOverview';
import SwipingStoryTagChips from './SwipingStoryTagChips';
import {HeroType} from '../../types/hero.type';
import {StoryTag} from '../../types/story.type';

type Props = {
  hero: HeroType;
};

const HeroStoryOverview = ({hero}: Props): JSX.Element => {
  return (
    <View>
      <HeroOverview hero={hero} />
    </View>
  );
};

export default HeroStoryOverview;
