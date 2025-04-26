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
  return (
    <ContentContainer
      backgroundColor={Color.GREY_100}
      borderRadius={size}
      width={size + 'px'}
      height={size + 'px'}
      alignCenter>
      <SvgIcon name={'my'} color={Color.GREY_400}></SvgIcon>
    </ContentContainer>
  );
};
