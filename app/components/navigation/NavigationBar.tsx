import {TopNavigationContainer} from '../styled/container/TopNavigationContainer';
import Text from '../styled/components/Text';
import SmallImage from '../styled/components/Image';
import React from 'react';
import {Pressable} from 'react-native';
import Icon from '../styled/components/Icon';
import {styles} from './styles';

const NavigationBar = (): JSX.Element => {
  return (
    <TopNavigationContainer>
      <SmallImage
        width={17}
        height={17}
        style={styles.logoImage}
        source={require('../../assets/images/puzzle-onepiece.png')}
      />
      <Text fontWeight={700} color={'#32C5FF'} style={styles.logoText}>
        인생퍼즐
      </Text>
      <Pressable style={styles.goToAccountIcon} onPress={() => {}}>
        <Icon name={'menu'} size={30} />
      </Pressable>
    </TopNavigationContainer>
  );
};

export default NavigationBar;
