import React from 'react';
import {Avatar} from 'react-native-paper';
import {StyleProp} from 'react-native';
import {Color} from '../../constants/color.constant.ts';

type Props = {
  imageURL: string | undefined;
  size: number;
  style?: StyleProp<any> | undefined;
  color?: string;
};

export const HeroAvatar = ({
  imageURL,
  size,
  style,
  color,
}: Props): JSX.Element => {
  if (!imageURL) {
    return (
      <Avatar.Icon
        style={{backgroundColor: Color.LIGHT_GRAY, ...style}}
        size={size}
        color={color}
        icon="account"
      />
    );
  }

  return (
    <Avatar.Image
      style={{backgroundColor: Color.LIGHT_GRAY, ...style}}
      size={size}
      source={{uri: imageURL}}
    />
  );
};
