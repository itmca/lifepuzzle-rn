import styled from 'styled-components/native';
import {Color} from '../../../constants/color.constant';

type Props = {
  letterSpacing?: number;
  fontWeight?: string | number;
  lineHeight?: number;
  color?: string;
  fontSize?: number;
};

export const XXLargeText = styled.Text<Props>`
  fontfamily: 'Pretendard';
  color: ${props => (props.color ? props.color : Color.BLACK)};
  fontsize: 24px;
  fontweight: bold;
`;

export const XLargeText = styled.Text<Props>`
  fontfamily: 'Pretendard';
  color: ${props => (props.color ? props.color : Color.BLACK)};
  fontsize: 20px;
  fontweight: bold;
`;

export const LargeText = styled.Text<Props>`
  fontfamily: 'Pretendard';
  color: ${props => (props.color ? props.color : Color.BLACK)};
  fontsize: 18px;
  fontweight: ${props => props.fontWeight || 'normal'};
`;

export const MediumText = styled.Text<Props>`
  fontfamily: 'Pretendard';
  color: ${props => (props.color ? props.color : Color.BLACK)};
  fontsize: 16px;
  fontweight: ${props => props.fontWeight || 'normal'};
`;

export const SmallText = styled.Text<Props>`
  fontfamily: 'Pretendard';
  color: ${props => (props.color ? props.color : Color.BLACK)};
  fontsize: 14px;
  fontweight: ${props => props.fontWeight || 'normal'};
  letterspacing: ${({letterSpacing}) =>
    letterSpacing ? `${letterSpacing}px` : '0.25px'};
`;

export const XSmallText = styled.Text<Props>`
  fontfamily: 'Pretendard';
  color: ${props => (props.color ? props.color : Color.BLACK)};
  fontsize: 12px;
`;

function Text({...props}) {
  return <MediumText {...props} />;
}

export default MediumText;
