import React from 'react';

import {Color} from '../../constants/color.constant';
import {ButtonBase} from '../styled/components/Button.tsx';
import {Title} from '../styled/components/Text.tsx';
import {IconName, SvgIcon} from '../styled/components/SvgIcon.tsx';

type Props = {
  onPress: () => void;
  disabled?: boolean;
  text?: string;
  iconName?: IconName;
};

export const BasicButton = ({
  onPress,
  disabled = false,
  text = '',
  iconName,
}: Props): JSX.Element => {
  return (
    <ButtonBase
      height={'56px'}
      width={'100%'}
      backgroundColor={disabled ? Color.GREY_200 : Color.MAIN_DARK}
      onPress={onPress}>
      {iconName && <SvgIcon name={iconName} />}
      <Title color={disabled ? Color.GREY_500 : Color.WHITE}>{text}</Title>
    </ButtonBase>
  );
};
