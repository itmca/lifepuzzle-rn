import React from 'react';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SvgIcon } from '../../display/SvgIcon.tsx';

type Props = {
  type: 'main' | 'sub';
};

const LoginHeaderLeft = ({ type }: Props): React.ReactElement => {
  const navigation = useNavigation();

  if (type === 'main') {
    return (
      <Pressable
        onPress={() => {
          navigation.navigate('App', {
            screen: 'Home',
          });
        }}
      >
        <SvgIcon name={'chevronLeft'} />
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={() => {
        navigation.goBack();
      }}
    >
      <SvgIcon name={'chevronLeft'} />
    </Pressable>
  );
};

export default LoginHeaderLeft;
