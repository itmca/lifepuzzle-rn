import React from 'react';

import {Color, ColorType} from '../../constants/color.constant';
import {ButtonBase} from '../styled/components/Button.tsx';
import {Title} from '../styled/components/Text.tsx';
import {IconName, SvgIcon} from '../styled/components/SvgIcon.tsx';
import {ContentContainer} from '../styled/container/ContentContainer.tsx';

type Props = {
  disabled?: boolean;
  text?: string;
  iconName?: IconName;
  iconSize?: number;
  backgroundColor?: ColorType;
  borderColor?: ColorType;
  textColor?: ColorType;
  height?: string;
  onPress: () => void;
};

export const BasicButton = ({
  disabled = false,
  text = '',
  iconName,
  backgroundColor = Color.MAIN_DARK,
  borderColor = Color.TRANSPARENT,
  textColor = Color.WHITE,
  height = '56px',
  iconSize = 24,
  onPress,
}: Props): JSX.Element => {
  return (
    <ButtonBase
      height={height}
      width={'100%'}
      backgroundColor={disabled ? Color.GREY_200 : backgroundColor}
      borderColor={borderColor}
      borderWidth={borderColor !== Color.TRANSPARENT ? 1 : 0}
      onPress={onPress}
      disabled={disabled}>
      {iconName && (
        <ContentContainer
          absoluteLeftPosition
          withNoBackground
          paddingLeft={16}>
          <SvgIcon name={iconName} size={iconSize} />
        </ContentContainer>
      )}
      <ContentContainer expandToEnd withNoBackground alignCenter>
        <Title color={disabled ? Color.GREY_500 : textColor}>{text}</Title>
      </ContentContainer>
    </ButtonBase>
  );
};
