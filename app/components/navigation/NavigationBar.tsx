import {TopNavigationContainer} from '../styled/container/TopNavigationContainer';
import Text from '../styled/components/Text';
import SmallImage from '../styled/components/Image';
import React from 'react';
import {Pressable} from 'react-native';
import Icon from '../styled/components/Icon';

const NavigationBar = (): JSX.Element => {
  return (
    <TopNavigationContainer>
      <SmallImage
        width={19}
        height={19}
        style={{transform: 'rotate(29.84deg)'}}
        source={require('../../assets/images/puzzle-onepiece.png')}
      />
      <Text
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: '#32C5FF',
          marginLeft: 3,
        }}>
        인생퍼즐
      </Text>
      <Pressable
        style={{marginLeft: 'auto', marginRight: 16}}
        onPress={() => {}}>
        <Icon name={'menu'} size={30} />
      </Pressable>
    </TopNavigationContainer>
  );
};

export default NavigationBar;
