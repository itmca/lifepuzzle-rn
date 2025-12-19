import React from 'react';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BasicNavigationProps } from '../../../../navigation/types.tsx';
import { SvgIcon } from '../../display/SvgIcon.tsx';

type Props = {
  type: 'main' | 'sub';
};

const LoginHeaderLeft = ({ type }: Props): React.ReactElement => {
  const navigation = useNavigation<BasicNavigationProps>();

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

export { LoginHeaderLeft };
