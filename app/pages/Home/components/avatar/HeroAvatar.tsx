import React from 'react';
import { Image, StyleProp, View, ViewStyle } from 'react-native';
import { Color } from '../../../../constants/color.constant.ts';
import { Profile } from '../../../../components/ui/display/Profile';

type Props = {
  imageUrl: string | undefined;
  size: number;
  style?: StyleProp<ViewStyle> | undefined;
};

export const HeroAvatar = ({
  imageUrl,
  size,
  style,
}: Props): React.ReactElement => {
  if (!imageUrl) {
    return <Profile size={size} />;
  }

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: Color.GREY,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Image
        style={{ width: '100%', height: '100%' }}
        source={{ uri: imageUrl }}
      />
    </View>
  );
};
