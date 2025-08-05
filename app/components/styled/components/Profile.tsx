import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../../navigation/types.tsx';
import {ContentContainer} from '../container/ContentContainer.tsx';
import {Color} from '../../../constants/color.constant.ts';
import {SvgIcon} from './SvgIcon.tsx';
type Props = {
  size?: number;
};

export const Profile = ({size = 52}: Props): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  return <SvgIcon name={'profile'} size={size} />;
};
