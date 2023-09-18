import React from 'react';
import {View} from 'react-native';
import HeroOverview from './HeroOverview';
import {HeroType} from '../../types/hero.type';

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
