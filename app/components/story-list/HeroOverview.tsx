import React from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import {HeroType} from '../../types/hero.type';
import Text from '../styled/components/Text';
import {HomeLoginButton} from '../button/HomeLoginButton';

type Props = {
  hero: HeroType;
};

const HeroOverview = ({hero}: Props): JSX.Element => {
  return (
    <View style={styles.profileContainer}>
      {hero.heroNo !== -1 ? (
        <View>
          <Text style={styles.titleText}>
            안녕하세요? {'\n'}
            {hero.heroNickName} 님
          </Text>
        </View>
      ) : (
        <View
          style={{
            width: '100%',
            gap: 10,
          }}>
          <Text style={styles.titleText}>
            우리, 한조각씩 {'\n'}
            함께해 봐요!
          </Text>
          <HomeLoginButton />
        </View>
      )}
    </View>
  );
};

export default HeroOverview;
