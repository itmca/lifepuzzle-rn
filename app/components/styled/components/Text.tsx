import styled from 'styled-components/native';
import {TextProps} from 'react-native';

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
  color?: string;

  alignCenter?: boolean;
  bold?: boolean;
};

type CustomTextProps = Pick<
  TextProps,
  'ellipsizeMode' | 'numberOfLines' | 'children'
> & {
  color?: string; //TODO ColorType으로 변경 예정
};

const TextBase = styled.Text<TextBaseProps>`
  font-family: ${props => props.fontFamily};
  font-size: ${props => props.fontSize}px;
  line-height: ${props => (props.fontSize * props.lineHeightPercent) / 100}px;
  letter-spacing: ${props => props.letterSpacing};
  color: ${props => (props.color ? props.color : 'black')};
`;

type CustomTextProps = Pick<
  TextProps,
  'ellipsizeMode' | 'numberOfLines' | 'children'
> & {
  // TODO(border-line): change to color type
  color?: string;
};

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
