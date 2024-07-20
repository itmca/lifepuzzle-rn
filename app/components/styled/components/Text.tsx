import styled, {css} from 'styled-components/native';
import {Color} from '../../../constants/color.constant';
import {TextProps} from 'react-native';

type PartialTextProps = Pick<
  TextProps,
  'ellipsizeMode' | 'numberOfLines' | 'children'
> & {
  letterSpacing?: number;
  fontWeight?: string | number;
  lineHeight?: string | number;
  color?: string;
  fontSize?: number;
  alignCenter?: boolean;
};

const TextBase = styled.Text<PartialTextProps>`
  font-family: 'Pretendard';
  color: ${props => (props.color ? props.color : Color.BLACK)};
  font-weight: ${props => props.fontWeight || 'normal'};
  ${props =>
    props.fontSize &&
    css`
      font-size: ${props.fontSize}px;
      line-height: ${props.lineHeight ?? props.fontSize * 1.2}px;
    `};
  ${props => props.alignCenter && 'text-align: center;'};
`;

export const XXXLargeText = (props: PartialTextProps) => (
  <TextBase fontSize={26} {...props} />
);

export const XXLargeText = (props: PartialTextProps) => (
  <TextBase fontSize={24} {...props} />
);

export const XLargeText = (props: PartialTextProps) => (
  <TextBase fontSize={20} {...props} />
);

export const LargeText = (props: PartialTextProps) => (
  <TextBase fontSize={18} {...props} />
);

export const MediumText = (props: PartialTextProps) => (
  <TextBase fontSize={16} {...props} />
);

export const SmallText = (props: PartialTextProps) => (
  <TextBase fontSize={14} {...props} />
);

export const XSmallText = (props: PartialTextProps) => (
  <TextBase fontSize={12} {...props} />
);
export const XXSmallText = (props: PartialTextProps) => (
  <TextBase fontSize={10} {...props} />
);

export default MediumText;
