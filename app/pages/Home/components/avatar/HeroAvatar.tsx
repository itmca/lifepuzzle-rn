import React from 'react';
import { Avatar } from 'react-native-paper';
import { StyleProp } from 'react-native';
import { Color } from '../../../../constants/color.constant.ts';
import { Profile } from '../../../../components/ui/display/Profile';

type Props = {
  imageURL: string | undefined;
  size: number;
  style?: StyleProp<any> | undefined;
};

export const HeroAvatar = ({
  imageURL,
  size,
  style,
}: Props): React.ReactElement => {
  if (!imageURL) {
    return <Profile />;
  }

  return (
    <Avatar.Image
      style={{ backgroundColor: Color.GREY, ...style }}
      size={size}
      source={{ uri: imageURL }}
    />
  );
};
