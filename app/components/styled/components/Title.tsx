import styled, {css} from 'styled-components/native';
import {LegacyColor} from '../../../constants/color.constant';
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

const TitleBase = styled.Text<PartialTextProps>`
  font-family: 'Pretendard';
  color: ${props => (props.color ? props.color : LegacyColor.BLACK)};
  font-weight: ${props => props.fontWeight || '700'};
  ${props =>
    props.fontSize &&
    css`
      font-size: ${props.fontSize}px;
      line-height: ${props.lineHeight ?? props.fontSize * 1.2}px;
    `};
  ${props => props.alignCenter && 'text-align: center;'};
`;

export const XLargeTitle = (props: PartialTextProps) => (
  <TitleBase fontSize={32} {...props} />
);

export const LargeTitle = (props: PartialTextProps) => (
  <TitleBase fontSize={24} {...props} />
);

export const MediumTitle = (props: PartialTextProps) => (
  <TitleBase fontSize={20} {...props} />
);

export const SmallTitle = (props: PartialTextProps) => (
  <TitleBase fontSize={18} {...props} />
);

export const XSmallTitle = (props: PartialTextProps) => (
  <TitleBase fontSize={16} {...props} />
);

function Title({...props}) {
  return <MediumTitle {...props} />;
}

export default Title;
