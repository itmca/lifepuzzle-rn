import React from 'react';
import {Avatar} from 'react-native-paper';
import {StyleProp} from 'react-native';
import {Color} from '../../constants/color.constant.ts';
import {Profile} from '../styled/components/Profile.tsx';

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
    return <Profile />;
  }

  return (
    <Avatar.Image
      style={{backgroundColor: Color.GRAY, ...style}}
      size={size}
      source={{uri: imageURL}}
    />
  );
};
