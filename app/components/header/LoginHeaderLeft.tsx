import React from 'react';
import {Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

type Props = {
  type: 'main' | 'sub';
};

const LoginHeaderLeft = ({type}: Props): JSX.Element => {
  const navigation = useNavigation();
  if (type === 'main') {
    return (
      <Pressable
        onPress={() => {
          navigation.push('HomeTab', {
            screen: 'Home',
          });
        }}>
        <Icon name={'close'} size={24} />
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={() => {
        navigation.goBack();
      }}>
      <Icon name={'chevron-left'} size={24} />
    </Pressable>
  );
};

export default LoginHeaderLeft;
