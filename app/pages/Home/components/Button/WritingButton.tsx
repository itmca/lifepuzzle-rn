import React from 'react';

import {Color} from '../../../../constants/color.constant';

import {ButtonBase} from '../../../../components/styled/components/Button.tsx';
import {SvgIcon} from '../../../../components/styled/components/SvgIcon.tsx';
import {Title} from '../../../../components/styled/components/Text.tsx';
import {ContentContainer} from '../../../../components/styled/container/ContentContainer.tsx';

type Props = {
  onPress: () => void;
  disabled?: boolean;
};
export const WritingButton = ({
  onPress,
  disabled = false,
}: Props): JSX.Element => {
  return (
    <ButtonBase
      height={'56px'}
      width={'100%'}
      disabled={disabled}
      backgroundColor={disabled ? Color.GREY_100 : Color.MAIN_DARK}
      borderRadius={6}
      onPress={disabled ? undefined : onPress}>
      <ContentContainer
        gap={8}
        useHorizontalLayout
        backgroundColor="transparent"
        alignCenter>
        <SvgIcon
          name={'camera'}
          size={24}
          color={disabled ? Color.GREY_300 : Color.WHITE}
        />
        <Title color={disabled ? Color.GREY_300 : Color.WHITE}>
          사진/동영상 추가하기
        </Title>
      </ContentContainer>
    </ButtonBase>
  );
};
