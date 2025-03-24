import React from 'react';
import styled from 'styled-components/native';
import {TouchableOpacity} from 'react-native';
import {Color} from '../../../constants/color.constant.ts';
import {Caption} from './Text.tsx';

type Props = {
  text?: string;
  color: string; //TODO ColorType으로 변경 예정
  onPress?: () => void;
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
function Tag({text, color = 'grey', onPress}: Props) {
  return (
    <StyledTag onPress={onPress} color={color}>
      <Caption color={getTxColor(color)}>{text ?? ''}</Caption>
    </StyledTag>
  );
}
export default Tag;
