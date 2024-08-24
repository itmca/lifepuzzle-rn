import React from 'react';
import {Avatar} from 'react-native-paper';
import {StyleProp} from 'react-native';
import {Color} from '../../constants/color.constant.ts';

type Props = {
  imageURL: string | undefined;
  size: number;
  style?: StyleProp<any> | undefined;
};

export const AccountAvatar = ({imageURL, size, style}: Props): JSX.Element => {
  if (!imageURL) {
    return (
      <Avatar.Icon
        style={{backgroundColor: Color.LIGHT_GRAY, ...style}}
        size={size}
        icon="account"
      />
    );
  }

  return <Avatar.Image style={style} size={size} source={{uri: imageURL}} />;
};
