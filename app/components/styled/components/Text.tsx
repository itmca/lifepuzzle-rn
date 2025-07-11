import styled, {css} from 'styled-components/native';
import {TextProps} from 'react-native';
import {ColorType} from '../../../constants/color.constant.ts';

type TextBaseProps = Pick<
  TextProps,
  'ellipsizeMode' | 'numberOfLines' | 'children'
> & {
  fontFamily:
    | 'SUIT-Bold'
    | 'SUIT-ExtraBold'
    | 'SUIT-ExtraLight'
    | 'SUIT-Heavy'
    | 'SUIT-Light'
    | 'SUIT-Medium'
    | 'SUIT-Regular'
    | 'SUIT-SemiBold'
    | 'SUIT-Thin';
  fontSize: number;
  lineHeightPercent: number;
  letterSpacing?: number;
  color?: ColorType;

  alignCenter?: boolean;
  bold?: boolean;
  underline?: boolean;
};

type CustomTextProps = Pick<
  TextProps,
  'ellipsizeMode' | 'numberOfLines' | 'children'
> & {color?: ColorType; underline?: boolean};

const TextBase = styled.Text<TextBaseProps>`
  font-family: ${props => props.fontFamily};
  font-size: ${props => props.fontSize}px;
  line-height: ${props => (props.fontSize * props.lineHeightPercent) / 100}px;
  letter-spacing: ${props => props.letterSpacing};
  color: ${props => (props.color ? props.color : 'black')};
  ${props =>
    props.underline
      ? css`
          border-bottom-width: 1px;
          border-bottom-color: ${props.color ? props.color : 'black'};
          padding-bottom: 1px;
        `
      : ''};
`;

export const Head = (props: CustomTextProps) => (
  <TextBase
    fontSize={22}
    fontFamily={'SUIT-ExtraBold'}
    lineHeightPercent={140}
    letterSpacing={-0.25}
    {...props}
  />
);

export const Title = (props: CustomTextProps) => (
  <TextBase
    fontSize={16}
    fontFamily={'SUIT-SemiBold'}
    lineHeightPercent={140}
    letterSpacing={-0.25}
    {...props}
  />
);

export const BodyTextB = (props: CustomTextProps) => (
  <TextBase
    fontSize={14}
    fontFamily={'SUIT-Bold'}
    lineHeightPercent={140}
    letterSpacing={-0.25}
    {...props}
  />
);

export const BodyTextM = (props: CustomTextProps) => (
  <TextBase
    fontSize={14}
    fontFamily={'SUIT-Medium'}
    lineHeightPercent={140}
    letterSpacing={-0.25}
    {...props}
  />
);

export const Caption = (props: CustomTextProps) => (
  <TextBase
    fontSize={12}
    fontFamily={'SUIT-Bold'}
    lineHeightPercent={140}
    letterSpacing={-0.25}
    {...props}
  />
);
