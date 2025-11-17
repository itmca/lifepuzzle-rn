import React from 'react';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { Color } from '../../../../constants/color.constant';

type Props = {
  type: 'cancel' | 'before';
};

const WritingHeaderLeft = ({ type }: Props): React.ReactElement => {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => {
        navigation.goBack();
      }}
    >
      <Icon
        size={32}
        color={Color.GREY_300}
        style={{ marginLeft: -10 }}
        name={type === 'cancel' ? 'x' : 'chevron-left'}
      />
    </Pressable>
  );
};

export default WritingHeaderLeft;
