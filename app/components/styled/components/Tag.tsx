import React from 'react';
import styled from 'styled-components/native';
import {TouchableOpacity} from 'react-native';
import {Color, ColorType} from '../../../constants/color.constant.ts';
import {Caption} from './Text.tsx';
import {IconName, SvgIcon} from './SvgIcon.tsx';
import {ContentContainer} from '../container/ContentContainer.tsx';

type Props = {
  text?: string;
  color: string; //TODO ColorType으로 변경 예정
  onPress?: () => void;
  icon?: IconName;
  iconColor?: ColorType;
};
function getTxColor(color: string) {
  return color === Color.GREY ? Color.GREY_400 : Color.WHITE;
}
export const StyledTag = styled(TouchableOpacity)<Props>`
  width: 'auto';
  height: 'auto';
  background-color: ${props => props.color};
  border-radius: 16px;
  border-width: ${props => (props.color === Color.GREY ? 1 : 0)};
  border-color: ${props =>
    props.color === Color.GREY ? Color.GREY_200 : 'transparent'};
  padding: 5.5px 10px;
`;
function Tag({icon, iconColor, text, color = 'grey', onPress}: Props) {
  return (
    <StyledTag onPress={onPress} color={color}>
      <ContentContainer
        useHorizontalLayout
        width={'auto'}
        gap={0}
        withNoBackground
        alignCenter
        paddingRight={color ? 4 : 0}>
        {icon && <SvgIcon name={icon} color={iconColor} size={16} />}
        <Caption color={iconColor ? iconColor : getTxColor(color)}>
          {text ?? ''}
        </Caption>
      </ContentContainer>
    </StyledTag>
  );
}
export default Tag;
