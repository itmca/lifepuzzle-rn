import React from 'react';
import {SvgIcon} from './SvgIcon.tsx';

type Props = {
  size?: number;
};

export const Profile = ({size = 52}: Props): JSX.Element => {
  return <SvgIcon name={'profile'} size={size} />;
};
