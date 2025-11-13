import React from 'react';

import {Color} from '../../../constants/color.constant';
import {ButtonBase} from '../../ui/base/ButtonBase';
import {Caption} from '../../ui/base/TextBase';
import {SvgIcon} from '../../ui/display/SvgIcon.tsx';

type Props = {
  onPress: () => void;
  playDurationText: string;
};

export const VoicePlayButton = ({
  onPress,
  playDurationText,
}: Props): JSX.Element => {
  return (
    <ButtonBase
      height={'28x'}
      width={'auto'}
      backgroundColor={Color.TRANSPARENT}
      borderColor={Color.MAIN_DARK}
      paddingVertical={6}
      paddingLeft={4}
      paddingRight={6}
      borderRadius={6}
      borderWidth={1}
      onPress={onPress}
      borderInside>
      <SvgIcon name={'play'} color={Color.MAIN_DARK} size={16} />
      <Caption color={Color.MAIN_DARK}>{playDurationText}</Caption>
    </ButtonBase>
  );
};
