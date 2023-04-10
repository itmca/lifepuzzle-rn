import React from 'react';
import {HeroType} from '../../types/hero.type';
import {Avatar} from 'react-native-paper';
import {StyleProp} from 'react-native';

type Props = {
  imageURL: string | undefined;
  size: number;
  style?: StyleProp<any> | undefined;
};

export const HeroAvatar = ({imageURL, size, style}: Props): JSX.Element => {
  if (!imageURL) {
    return <Avatar.Icon style={style} size={size} icon="account" />;
  }

  return <Avatar.Image style={style} size={size} source={{uri: imageURL}} />;
};
