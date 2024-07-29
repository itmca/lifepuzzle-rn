import React from 'react';
import {Avatar} from 'react-native-paper';
import {StyleProp} from 'react-native';

type Props = {
  imageURL: string | undefined;
  size: number;
  style?: StyleProp<any> | undefined;
  color?: string;
};

export const AccountAvatar = ({
  imageURL,
  size,
  style,
  color,
}: Props): JSX.Element => {
  if (!imageURL) {
    return (
      <Avatar.Icon style={style} size={size} color={color} icon="account" />
    );
  }

  return <Avatar.Image style={style} size={size} source={{uri: imageURL}} />;
};
