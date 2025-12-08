import styled, { css } from 'styled-components/native';
import { TextProps } from 'react-native';
import { ColorType } from '../../../constants/color.constant.ts';

type TextBaseProps = Pick<
  TextProps,
  'ellipsizeMode' | 'numberOfLines' | 'children'
> & {
  fontFamily: 'SUIT-Bold' | 'SUIT-ExtraBold' | 'SUIT-Medium' | 'SUIT-SemiBold';
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
> & { color?: ColorType; underline?: boolean };

const TextBase = styled.Text<TextBaseProps>`
  font-family: ${(props: TextBaseProps) => props.fontFamily};
  font-size: ${(props: TextBaseProps) => props.fontSize}px;
  line-height: ${(props: TextBaseProps) =>
    (props.fontSize * props.lineHeightPercent) / 100}px;
  ${(props: TextBaseProps) =>
    props.letterSpacing !== undefined &&
    `letter-spacing: ${props.letterSpacing}px;`}
  color: ${(props: TextBaseProps) => (props.color ? props.color : 'black')};
  ${(props: TextBaseProps) =>
    props.underline
      ? css`
          border-bottom-width: 1px;
          border-bottom-color: ${props.color ? props.color : 'black'};
          padding-bottom: 1px;
        `
      : ''};
`;

// TODO: 앨범에서 선택된 순서를 나타내는 사진 인덱스를 위한 것으로 디자이너분께 확인 후 디자인 시스템에 편입 필요
export const PhotoIndex = (props: CustomTextProps) => (
  <TextBase
    fontSize={32}
    fontFamily={'SUIT-ExtraBold'}
    lineHeightPercent={140}
    letterSpacing={-0.25}
    {...props}
  />
);

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
