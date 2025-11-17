import React from 'react';

import { Color } from '../../../constants/color.constant.ts';
import { ButtonBase } from '../../ui/base/ButtonBase';
import { SvgIcon } from '../../ui/display/SvgIcon.tsx';
import { ContentContainer } from '../../ui/layout/ContentContainer';

type Props = {
  visiable?: boolean;
  onPress: () => void;
};

export const RecordButton = ({
  visiable = true,
  onPress,
}: Props): React.ReactElement => {
  return (
    <ButtonBase
      height={'64px'}
      width={'auto'}
      backgroundColor={Color.TRANSPARENT}
      borderRadius={32}
      onPress={onPress}
      borderInside
    >
      <SvgIcon name={'recordRound'} color={Color.MAIN_DARK} size={64} />
    </ButtonBase>
  );
};

export const StopButton = ({ onPress }: Props): React.ReactElement => {
  return (
    <ButtonBase
      height={'64px'}
      width={'auto'}
      backgroundColor={Color.TRANSPARENT}
      borderRadius={64}
      onPress={onPress}
      borderInside
    >
      <SvgIcon name={'stopRound'} color={Color.MAIN_DARK} size={64} />
    </ButtonBase>
  );
};

export const PauseButton = ({ onPress }: Props): React.ReactElement => {
  return (
    <ButtonBase
      height={'64px'}
      width={'auto'}
      backgroundColor={Color.TRANSPARENT}
      borderRadius={64}
      onPress={onPress}
    >
      <SvgIcon name={'pauseRound'} color={Color.MAIN_DARK} size={64} />
    </ButtonBase>
  );
};

export const PlayButton = ({ onPress }: Props): React.ReactElement => {
  return (
    <ButtonBase
      height={'64px'}
      width={'auto'}
      backgroundColor={Color.TRANSPARENT}
      borderRadius={64}
      onPress={onPress}
      borderInside
    >
      <SvgIcon name={'playRound'} color={Color.MAIN_DARK} size={64} />
    </ButtonBase>
  );
};

export const CheckButton = ({
  onPress,
  visiable,
}: Props): React.ReactElement => {
  if (!visiable) {
    return <ContentContainer width={40} />;
  }
  return (
    <ButtonBase
      height={'40px'}
      width={'auto'}
      style={{ alignSelf: 'center' }}
      backgroundColor={Color.TRANSPARENT}
      borderRadius={40}
      onPress={onPress}
      borderInside
    >
      <SvgIcon name={'checkRound'} color={Color.MAIN_DARK} size={40} />
    </ButtonBase>
  );
};

export const DeleteButton = ({
  onPress,
  visiable,
}: Props): React.ReactElement => {
  if (!visiable) {
    return <ContentContainer width={40} />;
  }
  return (
    <ButtonBase
      height={'40px'}
      width={'auto'}
      style={{ alignSelf: 'center' }}
      backgroundColor={Color.TRANSPARENT}
      borderRadius={40}
      onPress={onPress}
      borderInside
    >
      <SvgIcon name={'deleteRound'} color={Color.MAIN_DARK} size={40} />
    </ButtonBase>
  );
};
