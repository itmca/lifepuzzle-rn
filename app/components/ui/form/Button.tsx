import React from 'react';

import { Color, ColorType } from '../../../constants/color.constant';
import { ButtonBase } from '../base/ButtonBase';
import { Title } from '../base/TextBase';
import { IconName, SvgIcon } from '../display/SvgIcon.tsx';
import { ContentContainer } from '../layout/ContentContainer';
import { SizeValue } from '../../../types/ui/style.type';

type Props = {
  disabled?: boolean;
  text?: string;
  iconName?: IconName;
  iconSize?: number;
  backgroundColor?: ColorType;
  borderColor?: ColorType;
  textColor?: ColorType;
  disabledBackgroundColor?: ColorType;
  disabledBorderColor?: ColorType;
  disabledTextColor?: ColorType;
  height?: SizeValue;
  borderRadius?: number;
  onPress: () => void;
};

export const BasicButton = ({
  disabled = false,
  text = '',
  iconName,
  backgroundColor = Color.MAIN_DARK,
  borderColor = Color.TRANSPARENT,
  textColor = Color.WHITE,
  disabledBackgroundColor = Color.GREY_200,
  disabledBorderColor,
  disabledTextColor = Color.GREY_500,
  height = 56,
  iconSize = 24,
  borderRadius,
  onPress,
}: Props): React.ReactElement => {
  const resolvedBackgroundColor = disabled
    ? (disabledBackgroundColor ?? Color.GREY_200)
    : backgroundColor;
  const resolvedBorderColor = disabled
    ? (disabledBorderColor ?? borderColor)
    : borderColor;
  const resolvedTextColor = disabled
    ? (disabledTextColor ?? Color.GREY_500)
    : textColor;
  return (
    <ButtonBase
      height={height}
      width={'100%'}
      backgroundColor={resolvedBackgroundColor}
      borderColor={resolvedBorderColor}
      borderWidth={resolvedBorderColor !== Color.TRANSPARENT ? 1 : 0}
      borderRadius={borderRadius}
      onPress={onPress}
      disabled={disabled}
    >
      {iconName && (
        <ContentContainer
          absoluteLeftPosition
          withNoBackground
          paddingLeft={16}
        >
          <SvgIcon name={iconName} size={iconSize} />
        </ContentContainer>
      )}
      <ContentContainer expandToEnd withNoBackground alignCenter>
        <Title color={resolvedTextColor}>{text}</Title>
      </ContentContainer>
    </ButtonBase>
  );
};
