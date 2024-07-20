import React from 'react';
import styled, {css} from 'styled-components/native';
import {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TouchableOpacity,
} from 'react-native';
import {XSmallImage} from './Image';
import {XXSmallText} from './Text';
import {ContentContainer} from '../container/ContentContainer.tsx';

type Props = {
  iconSource?: ImageSourcePropType;
  iconStyle?: StyleProp<ImageStyle>;
  text?: string;
  width?: string;
  height?: string;
  backgroundColor?: string;
  borderRadius?: string;
  padding?: string;
  alignItems?: string;
  alignSelf?: string;
  justifyContent?: string;
  marginRight?: number;
};
type TextProps = {
  color?: string;
  fontWeight?: string;
};
export const StyledTag = styled(TouchableOpacity)<Props>`
  width: ${({width}) => (width ? `${width}` : 'auto')};
  height: ${({height}) => (height ? `${height}` : '18px')};
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
function Tag({iconSource, iconStyle, text = '', ...props}: Props) {
  return (
    <StyledTag borderRadius={'20px'} {...props}>
      <ContentContainer useHorizontalLayout gap={0} width={'auto'}>
        {iconSource ? (
          <XSmallImage style={iconStyle} source={iconSource} />
        ) : (
          <></>
        )}
        <XXSmallText fontWeight={600}>{text}</XXSmallText>
      </ContentContainer>
    </StyledTag>
  );
}
export default Tag;
