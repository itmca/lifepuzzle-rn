import React from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import {HeroType} from '../../types/hero.type';
import {HeroAvatar} from '../avatar/HeroAvatar';
import {MediumText, SmallText} from '../styled/components/Text';
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
          style={styles.heroAvatarIcon}
        />
        <View>
          <View style={styles.titleTextContainer}>
            <MediumText fontWeight={700} color={'#32C5FF'}>
              {hero.heroNickName}
            </MediumText>
            <SmallText fontWeight={400} color={'#A9A9A9'}>
              {' '}
              님
            </SmallText>
          </View>
          <View style={styles.contentTextContainer}>
            <SmallText fontWeight={'400'} color={'#A9A9A9'}>
              퍼즐{' '}
              <SmallText fontWeight={'700'} color={'#32C5FF'}>
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
