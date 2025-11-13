import React from 'react';

import {Color} from '../../../constants/color.constant';
import {ButtonBase} from '../../ui/base/ButtonBase';
import {Caption} from '../../ui/base/TextBase';
import {SvgIcon} from '../../ui/display/SvgIcon.tsx';

type Props = {
  onPress: () => void;
};

export const VoiceAddButton = ({onPress}: Props): JSX.Element => {
  return (
    <ButtonBase
      height={'28x'}
      width={'auto'}
      backgroundColor={Color.TRANSPARENT}
      borderColor={Color.GREY_200}
      paddingVertical={6}
      paddingLeft={4}
      paddingRight={8}
      borderRadius={6}
      borderWidth={1}
      onPress={onPress}
      borderInside>
      <SvgIcon name={'plus'} color={Color.MAIN_DARK} size={16} />
      <Caption color={Color.GREY_600}>음성 메모 추가</Caption>
    </ButtonBase>
  );
};
