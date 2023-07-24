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
  font-family: 'Pretendard';
  color: ${props => (props.color ? props.color : Color.BLACK)};
  font-size: 24px;
`;

export const XLargeText = styled.Text<Props>`
  font-family: 'Pretendard';
  color: ${props => (props.color ? props.color : Color.BLACK)};
  font-size: 20px;
`;

export const LargeText = styled.Text<Props>`
  font-family: 'Pretendard';
  color: ${props => (props.color ? props.color : Color.BLACK)};
  font-size: 18px;
  font-weight: ${props => props.fontWeight || 'normal'};
`;

export const MediumText = styled.Text<Props>`
  font-family: 'Pretendard';
  color: ${props => (props.color ? props.color : Color.BLACK)};
  font-size: 16px;
  font-weight: ${props => props.fontWeight || 'normal'};
`;

export const SmallText = styled.Text<Props>`
  font-family: 'Pretendard';
  color: ${props => (props.color ? props.color : Color.BLACK)};
  font-size: 14px;
  font-weight: ${props => props.fontWeight || 'normal'};
  letter-spacing: ${({letterSpacing}) =>
    letterSpacing ? `${letterSpacing}px` : '0.25px'};
`;

export const XSmallText = styled.Text<Props>`
  font-family: 'Pretendard';
  color: ${props => (props.color ? props.color : Color.BLACK)};
  font-size: 12px;
`;

function Text({...props}) {
  return <MediumText {...props} />;
}

export default MediumText;
