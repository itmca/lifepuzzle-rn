import React from 'react';
import styled from 'styled-components/native';
import { Text, TouchableOpacity } from "react-native";

type Props = {
  height?: number;
  borderRadius?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  alignItems?: string;
  justifyContent?: string;
  marginRight?: number;
};
type TextProps = {
  fontSize?: number;
  letterSpacing?: string;
};
export const StyledTag = styled(TouchableOpacity)<Props>`
    height: ${({ height }) => (height ? `${height}px` : '26px')};
    borderRadius: ${({ borderRadius }) => (borderRadius ? `${borderRadius}px` : '16px')};
    paddingTop: ${({ paddingTop }) => (paddingTop ? `${paddingTop}px` : '4px')};
    paddingBottom: ${({ paddingBottom }) => (paddingBottom ? `${paddingBottom}px` : '4px')};
    paddingLeft: ${({ paddingLeft }) => (paddingLeft ? `${paddingLeft}px` : '12px')};
    paddingRight: ${({ paddingRight }) => (paddingRight ? `${paddingRight}px` : '12px')};
    alignItems: ${({ alignItems }) => (alignItems ? `${alignItems}` : 'center')};
    justifyContent: ${({ justifyContent }) => (justifyContent ? `${justifyContent}` : 'center')};
    marginRight: ${({ marginRight }) => (marginRight ? `${marginRight}px` : '17px')};
`;
export const StyledTagText = styled(Text)<TextProps>`
    fontSize: ${({ fontSize }) => (fontSize ? `${fontSize}px` : '14px')};
    letterSpacing: ${({ letterSpacing }) => (letterSpacing ? `${letterSpacing}px` : '0.25px')};
`;
function Tag({text="",textColor="#FFFFFF", ...props }) {
  return (
    <StyledTag {...props} >
      <StyledTagText style={[{color: textColor},]}>
        {text}
      </StyledTagText>
    </StyledTag>
  );
}
export default Tag;

