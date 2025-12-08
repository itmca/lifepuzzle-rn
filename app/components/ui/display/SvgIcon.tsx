import React from 'react';
import { Svgs } from '../../../constants/icon.constant';
import { TouchableOpacity } from 'react-native';

export type IconName = keyof typeof Svgs;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  onPress?: () => void;
}

export const SvgIcon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = 'transparent',
  onPress,
}) => {
  const SvgIcon = Svgs[name];
  if (!SvgIcon) {
    return null;
  }

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress}>
        <SvgIcon width={size} height={size} fill={color} />
      </TouchableOpacity>
    );
  }

  return <SvgIcon width={size} height={size} fill={color} />;
};
