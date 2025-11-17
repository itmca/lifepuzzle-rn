import React from 'react';
import { SvgIcon } from './SvgIcon.tsx';

type Props = {
  size?: number;
};

export const Profile = ({ size = 52 }: Props): React.ReactElement => {
  return <SvgIcon name={'profile'} size={size} />;
};
