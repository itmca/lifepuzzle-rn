import React from 'react';

import {Color} from '../../../constants/color.constant';
import {ButtonBase} from '../../ui/base/ButtonBase';
import {Caption} from '../../ui/base/TextBase';
import {SvgIcon} from '../../ui/display/SvgIcon.tsx';

type Props = {
  onPress: () => void;
};

export const ShareButton = ({onPress}: Props): JSX.Element => {
  return (
    <ButtonBase
      height={'28x'}
      width={'auto'}
      backgroundColor={Color.TRANSPARENT}
      borderColor={Color.MAIN_DARK}
      paddingVertical={4}
      paddingLeft={4}
      paddingRight={6}
      borderRadius={6}
      borderWidth={1}
      onPress={onPress}
      borderInside>
      <SvgIcon name={'link'} color={Color.MAIN_DARK} size={16} />
      <Caption color={Color.GREY_700}>공유</Caption>
    </ButtonBase>
  );
};
