import React from 'react';
import {Image, Pressable} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';
import { SmallImage } from "../styled/components/Image";

const DefaultHeaderLeft = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  const route = useRoute();
  return (
    <Pressable
      onPress={() => {
        if (route.name !== 'Home') {
          navigation.push('HomeTab', {screen: 'Home'});
        }
      }}>
      <SmallImage
        width={123}
        height={25}
        source={require('../../assets/images/puzzle-4piece-with-text.png')}
      />
    </Pressable>
  );
};

export default DefaultHeaderLeft;
