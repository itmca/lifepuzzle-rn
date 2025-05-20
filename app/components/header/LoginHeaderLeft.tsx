import React from 'react';
import {Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SvgIcon} from '../styled/components/SvgIcon.tsx';

type Props = {
  type: 'main' | 'sub';
};

const LoginHeaderLeft = ({type}: Props): JSX.Element => {
  const navigation = useNavigation();

  if (type === 'main') {
    return (
      <Pressable
        onPress={() => {
          navigation.navigate('HomeTab', {
            screen: 'Home',
          });
        }}>
        <SvgIcon name={'chevronLeft'} />
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={() => {
        navigation.goBack();
      }}>
      <SvgIcon name={'chevronLeft'} />
    </Pressable>
  );
};

export default LoginHeaderLeft;
