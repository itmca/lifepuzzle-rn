import React from 'react';

import {Color} from '../../constants/color.constant.ts';
import {ButtonBase} from '../styled/components/Button.tsx';
import {Title} from '../styled/components/Text.tsx';
import {SvgIcon} from '../styled/components/SvgIcon.tsx';
import {ContentContainer} from '../styled/container/ContentContainer.tsx';

type Props = {
  onPress: () => void;
};

export const AiPhotoMakerButton = ({onPress}: Props): JSX.Element => {
  return (
    <ButtonBase
      height={'56px'}
      width={'100%'}
      backgroundColor={Color.MAIN_DARK}
      borderRadius={6}
      onPress={onPress}>
      <ContentContainer
        gap={3}
        useHorizontalLayout
        backgroundColor="transparent"
        alignCenter>
        <SvgIcon name={'aiWhite'} size={24} />
        <Title color={Color.WHITE}>AI포토 만들기</Title>
      </ContentContainer>
    </ButtonBase>
  );
};
