import React from 'react';

import {Color} from '../../constants/color.constant';
import {ButtonBase} from '../styled/components/Button.tsx';
import {Title} from '../styled/components/Text.tsx';
import {SvgIcon} from '../styled/components/SvgIcon.tsx';

type Props = {
  onPress: () => void;
};

export const StoryWritingButton = ({onPress}: Props): JSX.Element => {
  return (
    <ButtonBase
      height={'44px'}
      width={'auto'}
      style={{alignSelf: 'center'}}
      backgroundColor={Color.TRANSPARENT}
      borderColor={Color.MAIN_DARK}
      paddingVertical={10}
      paddingLeft={14}
      paddingRight={16}
      borderRadius={100}
      borderWidth={1.5}
      onPress={onPress}
      borderInside>
      <SvgIcon name={'pencil'} size={24} />
      <Title color={Color.MAIN_DARK}>이야기 작성하기</Title>
    </ButtonBase>
  );
};
