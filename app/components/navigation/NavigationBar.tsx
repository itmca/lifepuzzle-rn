import {TopNavigationContainer} from '../styled/container/TopNavigationContainer';
import Text from '../styled/components/Text';
import SmallImage from '../styled/components/Image';
import React from 'react';
import {Pressable} from 'react-native';
import Icon from '../styled/components/Icon';
import {styles} from './styles';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';

const NavigationBar = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();

  type RootStackParamList = {
    Home: {screen?: string};
    Profile: {screen?: string};
  };

  const route =
    useRoute<RouteProp<RootStackParamList, keyof RootStackParamList>>();

  return (
    <TopNavigationContainer>
      <Pressable
        style={{flexDirection: 'row'}}
        onPress={() => {
          if (route.params?.screen !== 'Home') {
            navigation.push('HomeTab', {screen: 'Home'});
          }
        }}>
        <SmallImage
          width={17}
          height={17}
          style={styles.logoImage}
          source={require('../../assets/images/puzzle-onepiece.png')}
        />
        <Text fontWeight={700} color={'#32C5FF'} style={styles.logoText}>
          인생퍼즐
        </Text>
      </Pressable>
      <Pressable
        style={styles.goToAccountIcon}
        onPress={() => {
          if (route.params?.screen !== 'Profile') {
            navigation.push('HomeTab', {screen: 'Profile'});
          }
        }}>
        <Icon name={'menu'} size={30} />
      </Pressable>
    </TopNavigationContainer>
  );
};

export default NavigationBar;
