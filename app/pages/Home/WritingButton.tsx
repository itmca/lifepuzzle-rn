import React from 'react';

import {Color} from '../../constants/color.constant';

import {ButtonBase} from '../../components/styled/components/Button.tsx';
import {SvgIcon} from '../../components/styled/components/SvgIcon.tsx';
import {Title} from '../../components/styled/components/Text.tsx';
import {ContentContainer} from '../../components/styled/container/ContentContainer.tsx';

type Props = {
  onPress: () => void;
};
export const WritingButton = ({onPress}: Props): JSX.Element => {
  return (
    <ButtonBase
      height={'56px'}
      width={'100%'}
      backgroundColor={Color.MAIN_DARK}
      borderRadius={6}
      onPress={onPress}>
      <ContentContainer
        gap={8}
        useHorizontalLayout
        backgroundColor="transparent"
        alignCenter>
        <SvgIcon name={'camera'} size={24} />
        <Title color={Color.WHITE}>사진/동영상 추가하기</Title>
      </ContentContainer>
    </ButtonBase>
  );
};
