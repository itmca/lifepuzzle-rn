import React from 'react';
import styled, {css} from 'styled-components/native';
import {Text, TouchableOpacity} from 'react-native';
import {Color} from '../../../constants/color.constant';

type Props = {
  width?: string;
  height?: number;
  backgroundColor?: string;
  borderRadius?: number;
  padding?: string;
  alignItems?: string;
  alignSelf?: string;
  justifyContent?: string;
  marginRight?: number;
};
type TextProps = {
  width?: string;
  color?: string;
  fontSize?: number;
  fontWeight?: string;
  letterSpacing?: string;
};
export const StyledTag = styled(TouchableOpacity)<Props>`
  width: ${({width}) => (width ? `${width}` : 'auto')};
  height: ${({height}) => (height ? `${height}px` : '26px')};
  background-color: ${({backgroundColor}) =>
    backgroundColor ? `${backgroundColor}` : 'transparent'};
  padding: ${({padding}) => (padding ? `${padding}` : '3px 10px')};
  align-self: ${({alignSelf}) => (alignSelf ? alignSelf : 'flex-start')};
  ${props =>
    props.borderRadius &&
    css`
      border-top-left-radius: ${props.borderRadius};
      border-top-right-radius: ${props.borderRadius};
      border-bottom-left-radius: ${props.borderRadius};
      border-bottom-right-radius: ${props.borderRadius};
    `};
`;
export const StyledTagText = styled(Text)<TextProps>`
  width: ${({width}) => (width ? `${width}` : 'auto')};
  color: ${props => (props.color ? props.color : Color.WHITE)};
  font-size: ${props => (props.fontSize ? `${props.fontSize}px` : '14px')};
  font-weight: ${props => props.fontWeight || '500'};
  letter-spacing: ${({letterSpacing}) =>
    letterSpacing ? `${letterSpacing}px` : '0.25px'};
`;
function Tag({
  text = '',
  textColor = '#FFFFFF',
  fontSize = 14,
  fontWeight = '500',
  ...props
}) {
  return (
    <StyledTag {...props}>
      <StyledTagText
        color={textColor}
        fontSize={fontSize}
        fontWeight={fontWeight}>
        {text}
      </StyledTagText>
    </StyledTag>
  );
}
export default Tag;
