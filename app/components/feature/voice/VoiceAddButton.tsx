import React from 'react';

import { Color } from '../../../constants/color.constant';
import { ButtonBase } from '../../ui/base/ButtonBase';
import { SvgIcon } from '../../ui/display/SvgIcon.tsx';
import { BodyTextB } from '../../ui/base/TextBase.tsx';

type Props = {
  onPress: () => void;
};

export const VoiceAddButton = ({ onPress }: Props): React.ReactElement => {
  return (
    <ButtonBase
      height={'40px'}
      width={'auto'}
      backgroundColor={Color.TRANSPARENT}
      borderColor={Color.GREY_200}
      paddingVertical={6}
      paddingLeft={8}
      paddingRight={12}
      borderRadius={6}
      borderWidth={1}
      onPress={onPress}
      borderInside
    >
      <SvgIcon name={'plus'} color={Color.MAIN_DARK} size={16} />
      <BodyTextB color={Color.GREY_600}>음성으로 이야기 남기기</BodyTextB>
    </ButtonBase>
  );
};
