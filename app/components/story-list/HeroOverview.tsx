import React from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import {HeroType} from '../../types/hero.type';
import {XXLargeText} from '../styled/components/Text';
import {HomeLoginButton} from '../button/HomeLoginButton';

type Props = {
  hero: HeroType;
};

const HeroOverview = ({hero}: Props): JSX.Element => {
  return (
    <View style={styles.profileContainer}>
      {hero.heroNo !== -1 ? (
        <View>
          <XXLargeText style={{lineHeight: 35}}>
            안녕하세요? {'\n'}
            {hero.heroNickName} 님
          </XXLargeText>
        </View>
      ) : (
        <View
          style={{
            gap: 10,
          }}>
          <XXLargeText style={{lineHeight: 35}}>
            우리, 한조각씩 {'\n'}
            함께해 봐요!
          </XXLargeText>
          <HomeLoginButton />
        </View>
      )}
    </View>
  );
};

export default HeroOverview;
