import React from 'react';
import styled, {css} from 'styled-components/native';
import {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TouchableOpacity,
} from 'react-native';
import {XXSmallText} from './Text';
import {ContentContainer} from '../container/ContentContainer.tsx';
import {XXSmallImage} from './Image.tsx';

type Props = {
  iconSource?: ImageSourcePropType;
  iconStyle?: StyleProp<ImageStyle>;
  text?: string;
  width?: string;
  height?: string;
  fontWeight?: string | number;
  fontColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  padding?: string;
  alignItems?: string;
  alignSelf?: string;
  justifyContent?: string;
  marginRight?: number;
  onPress?: () => void;
};
type TextProps = {
  color?: string;
  fontWeight?: string;
};
export const StyledTag = styled(TouchableOpacity)<Props>`
  width: ${({width}) => (width ? `${width}` : 'auto')};
  height: ${({height}) => (height ? `${height}` : 'auto')};
  background-color: ${({backgroundColor}) =>
    backgroundColor ? `${backgroundColor}` : 'transparent'};
  padding: ${({padding}) => (padding ? `${padding}` : '2px 8px')};
  align-self: ${({alignSelf}) => (alignSelf ? alignSelf : 'flex-start')};
  ${props =>
    props.borderRadius &&
    css`
      border-top-left-radius: ${props.borderRadius}px;
      border-top-right-radius: ${props.borderRadius}px;
      border-bottom-left-radius: ${props.borderRadius}px;
      border-bottom-right-radius: ${props.borderRadius}px;
    `};
`;
function Tag({
  iconSource,
  iconStyle,
  text = '',
  fontWeight = 600,
  fontColor,
  ...props
}: Props) {
  return (
    <StyledTag borderRadius={16} {...props}>
      <ContentContainer
        useHorizontalLayout
        gap={0}
        width={'auto'}
        backgroundColor="transparent">
        {iconSource ? (
          <XXSmallImage style={iconStyle} source={iconSource} />
        ) : (
          <></>
        )}
        <XXSmallText fontWeight={fontWeight} color={fontColor} lineHeight={20}>
          {text}
        </XXSmallText>
      </ContentContainer>
    </StyledTag>
  );
}
export default Tag;
