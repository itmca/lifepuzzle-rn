import React from 'react';
import {Pressable, StyleProp, TextStyle, ViewStyle} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from '../styled/components/Icon';

type Props = {
  iconType?: 'close' | 'chevron-left';
  containerStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<TextStyle>;
  iconSize?: number;
  customAction?: Function;
};

const GoBackHeaderLeft = ({
  iconType = 'close',
  containerStyle,
  iconStyle,
  iconSize = 24,
  customAction,
}: Props): JSX.Element => {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => {
        if (typeof customAction === 'function') {
          customAction();
        }
        navigation.goBack();
      }}
      style={containerStyle}>
      <Icon style={iconStyle} name={iconType} size={iconSize} />
    </Pressable>
  );
};

export default GoBackHeaderLeft;
