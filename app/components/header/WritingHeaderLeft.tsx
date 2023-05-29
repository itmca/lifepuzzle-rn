import React from 'react';
import {Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from '../styled/components/Icon';

type Props = {
  type: 'cancel' | 'before';
};

const WritingHeaderLeft = ({type}: Props): JSX.Element => {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => {
        navigation.goBack();
      }}>
      <Icon name={type === 'cancel' ? 'close' : 'chevron-left'} />
    </Pressable>
  );
};

export default WritingHeaderLeft;
