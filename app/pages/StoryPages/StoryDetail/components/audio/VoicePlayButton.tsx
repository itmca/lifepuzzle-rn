import React from 'react';

import { Color } from '../../../../../constants/color.constant';
import { ButtonBase } from '../../../../../components/ui/base/ButtonBase';
import { Caption } from '../../../../../components/ui/base/TextBase';
import { SvgIcon } from '../../../../../components/ui/display/SvgIcon.tsx';

type Props = {
  onPress: () => void;
  playDurationText: string;
};

export const VoicePlayButton = ({
  onPress,
  playDurationText,
}: Props): React.ReactElement => {
  return (
    <ButtonBase
      height={'40px'}
      width={'auto'}
      backgroundColor={Color.TRANSPARENT}
      borderColor={Color.MAIN_DARK}
      paddingVertical={6}
      paddingLeft={12}
      paddingRight={20}
      borderRadius={6}
      borderWidth={1}
      onPress={onPress}
      gap={4}
      borderInside
    >
      <SvgIcon name={'play'} color={Color.MAIN_DARK} size={20} />
      <Caption color={Color.MAIN_DARK}>{playDurationText}</Caption>
    </ButtonBase>
  );
};
