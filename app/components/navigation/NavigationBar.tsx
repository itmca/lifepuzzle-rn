import {TopNavigationContainer} from '../styled/container/TopNavigationContainer';
import Text from '../styled/components/Text';
import SmallImage from '../styled/components/Image';
import React from 'react';
import {Pressable} from 'react-native';
import {styles} from './styles';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';
import {Color} from '../../constants/color.constant';

type Props = {
  displayRight?: boolean;
};
const NavigationBar = ({displayRight = true}: Props): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();

  return (
    <TopNavigationContainer>
      <Pressable
        style={styles.leftSection}
        onPress={() => {
          navigation.navigate('HomeTab', {screen: 'Home'});
        }}>
        <SmallImage
          width={17}
          height={17}
          style={styles.logoImage}
          source={require('../../assets/images/puzzle-onepiece.png')}
        />
        <Text
          fontWeight={700}
          color={Color.PRIMARY_LIGHT}
          style={styles.logoText}>
          인생퍼즐
        </Text>
      </Pressable>
      {displayRight && (
        <Pressable
          style={styles.goToAccountIcon}
          onPress={() => {
            navigation.navigate('HomeTab', {screen: 'Profile'});
          }}>
          <SmallImage
            source={require('../../assets/images/icon-profile.png')}
            width={30}
            height={30}
          />
        </Pressable>
      )}
    </TopNavigationContainer>
  );
};

export default NavigationBar;
