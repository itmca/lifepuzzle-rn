import React from 'react';
import {Svgs} from '../../../constants/icon.constant';

type IconName = keyof typeof Svgs;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export const SvgIcon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = 'transparent',
}) => {
  const SvgIcon = Svgs[name];
  if (!SvgIcon) {
    return null;
  }

  return <SvgIcon width={size} height={size} fill={color} />;
};
