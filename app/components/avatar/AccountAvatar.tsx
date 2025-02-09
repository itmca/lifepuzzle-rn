import React from 'react';
import {Avatar} from 'react-native-paper';
import {StyleProp} from 'react-native';
import {LegacyColor} from '../../constants/color.constant.ts';

type Props = {
  imageURL: string | undefined;
  size: number;
  style?: StyleProp<any> | undefined;
  nickName: string;
};

export const AccountAvatar = ({
  nickName,
  imageURL,
  size,
  style,
}: Props): JSX.Element => {
  console.log(imageURL, nickName);
  if (!imageURL) {
    return (
      <Avatar.Text
        style={{backgroundColor: LegacyColor.LIGHT_GRAY, ...style}}
        size={size}
        label={nickName[0]}
      />
    );
  }

  return (
    <Avatar.Image
      style={{backgroundColor: LegacyColor.LIGHT_GRAY, ...style}}
      size={size}
      source={{uri: imageURL}}
    />
  );
};
