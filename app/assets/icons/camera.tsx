import React from 'react';
import {Avatar} from 'react-native-paper';
import {StyleProp} from 'react-native';

type Props = {
  size: number;
  style?: StyleProp<any> | undefined;
  color?: string;
};

export const Camera = ({size, style, color}: Props): JSX.Element => {
  return <Avatar.Icon size={size} style={style} color={color} icon="camera" />;
};
