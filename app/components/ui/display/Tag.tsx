import React from 'react';
import styled from 'styled-components/native';
import { LayoutChangeEvent, TouchableOpacity } from 'react-native';
import { Color, ColorType } from '../../../constants/color.constant.ts';
import { Caption } from '../base/TextBase.tsx';
import { IconName, SvgIcon } from './SvgIcon.tsx';
import { ContentContainer } from '../layout/ContentContainer.tsx';

type Props = {
  text?: string;
  color: string; //TODO ColorType으로 변경 예정
  onPress?: () => void;
  onLayout?: (event: LayoutChangeEvent) => void;
  icon?: IconName;
  iconColor?: ColorType;
  paddingHorizontal?: number;
  paddingVertical?: number;
};
function getTxColor(color: string) {
  return color === Color.GREY ? Color.GREY_400 : Color.WHITE;
}
export const StyledTag = styled(TouchableOpacity)<Props>`
  width: 'auto';
  height: 'auto';
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${(props: Props) => props.color};
  border-radius: 16px;
  border-width: ${(props: Props) =>
    props.color === Color.GREY ? '1px' : '0px'};
  border-color: ${(props: Props) =>
    props.color === Color.GREY ? Color.GREY_200 : 'transparent'};
  padding: ${(props: Props) => props.paddingVertical ?? 6.5}px
    ${(props: Props) => props.paddingHorizontal ?? 11}px;
`;
function Tag({
  icon,
  iconColor,
  text,
  color = 'grey',
  onPress,
  onLayout,
  paddingHorizontal,
  paddingVertical,
}: Props) {
  return (
    <StyledTag
      onPress={onPress}
      onLayout={onLayout}
      color={color}
      paddingHorizontal={paddingHorizontal}
      paddingVertical={paddingVertical}
    >
      <ContentContainer
        useHorizontalLayout
        width={'auto'}
        gap={0}
        withNoBackground
        alignCenter
      >
        {icon && <SvgIcon name={icon} color={iconColor} size={16} />}
        <Caption color={iconColor ? iconColor : getTxColor(color)}>
          {text ?? ''}
        </Caption>
      </ContentContainer>
    </StyledTag>
  );
}
export { Tag };
