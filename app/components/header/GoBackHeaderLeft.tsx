import React from 'react';
import {Pressable, StyleProp, TextStyle, ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

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
