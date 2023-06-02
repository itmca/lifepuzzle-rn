import React from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import {HeroType} from '../../types/hero.type';
import {HeroAvatar} from '../avatar/HeroAvatar';
import Text, {SmallText, XSmallText} from '../styled/components/Text';
import NavigationBar from '../navigation/NavigationBar';

type Props = {
  hero: HeroType;
  storyCount: number;
};

const HeroOverview = ({hero, storyCount}: Props): JSX.Element => {
  return (
    <>
      <NavigationBar />
      <View style={styles.profileContainer}>
        <HeroAvatar
          imageURL={hero.imageURL}
          size={60}
          style={{marginLeft: 20, marginRight: 20, backgroundColor: '#A9A9A9'}}
        />
        <View style={styles.textContainer}>
          <View style={styles.titleTextContainer}>
            <Text style={{fontWeight: 700}} color="#32C5FF">
              {hero.heroNickName}
            </Text>
            <SmallText style={{fontWeight: 400, color: '#A9A9A9'}}>
              {' '}
              님
            </SmallText>
          </View>
          <View style={styles.contentTextContainer}>
            <SmallText style={{fontWeight: 400, color: '#A9A9A9'}}>
              퍼즐{' '}
              <SmallText style={{fontWeight: 700, color: '#32C5FF'}}>
                {storyCount}
              </SmallText>
              조각이 맞춰졌습니다.
            </SmallText>
          </View>
        </View>
      </View>
    </>
  );
};

export default HeroOverview;
