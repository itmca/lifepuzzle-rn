import React from 'react';
import {Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from '../styled/components/Icon';

type Props = {
  type: 'main' | 'sub';
  iconColor?: string;
};

const LoginHeaderLeft = ({type, iconColor}: Props): JSX.Element => {
  const navigation = useNavigation();
  if (type === 'main') {
    return (
      <Pressable
        onPress={() => {
          navigation.push('HomeTab', {
            screen: 'Home',
          });
        }}>
        <Icon name={'chevron-left'} />
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={() => {
        navigation.goBack();
      }}>
      <Icon name={'chevron-left'} color={iconColor} />
    </Pressable>
  );
};

export default LoginHeaderLeft;
