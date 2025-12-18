import React from 'react';

import { Color } from '../../../constants/color.constant';
import { ButtonBase } from '../../ui/base/ButtonBase';
import { Title } from '../../ui/base/TextBase';
import { SvgIcon } from '../../ui/display/SvgIcon.tsx';

type Props = {
  onPress: () => void;
};

export const StoryWritingButton = ({ onPress }: Props): React.ReactElement => {
  return (
    <ButtonBase
      height={'44px'}
      width={'auto'}
      style={{ alignSelf: 'center' }}
      backgroundColor={Color.TRANSPARENT}
      borderColor={Color.MAIN_DARK}
      paddingVertical={10}
      paddingLeft={14}
      paddingRight={16}
      borderRadius={100}
      borderWidth={1.5}
      onPress={onPress}
      borderInside
    >
      <SvgIcon name={'pencil'} size={24} />
      <Title color={Color.MAIN_DARK}>이야기 남기기</Title>
    </ButtonBase>
  );
};
