import React from 'react';
import {View} from 'react-native';
import HeroOverview from './HeroOverview';
import SwipingStoryTagChips from './SwipingStoryTagChips';
import {HeroType} from '../../types/hero.type';
import {StoryTag} from '../../types/story.type';

type Props = {
  hero: HeroType;
  tags: StoryTag[];
  onSelect: (tagKey: string) => void;
};

const HeroStoryOverview = ({hero, tags, onSelect}: Props): JSX.Element => {
  return (
    <View>
      <HeroOverview hero={hero} />
      <SwipingStoryTagChips tags={tags} onSelect={onSelect} />
    </View>
  );
};

export default HeroStoryOverview;
