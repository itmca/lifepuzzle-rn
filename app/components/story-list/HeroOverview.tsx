import React from 'react';
import {Text, View} from 'react-native';
import {styles} from './styles';
import {HeroType} from '../../types/hero.type';
import {HeroAvatar} from '../avatar/HeroAvatar';

type Props = {
  hero: HeroType;
  storyCount: number;
};

const HeroOverview = ({hero, storyCount}: Props): JSX.Element => {
  return (
    <View style={styles.profileContainer}>
      <HeroAvatar imageURL={hero.imageURL} size={72} />
      <Text style={styles.profileTitle}>{hero.title}</Text>
      <Text style={styles.profileText}>
        &quot;{hero.heroNickName}&quot;님의 퍼즐 {storyCount}조각이
        맞춰졌습니다.
        {storyCount > 0 ? '👏'.repeat(Math.min(storyCount, 3)) : ''}
      </Text>
    </View>
  );
};

export default HeroOverview;
