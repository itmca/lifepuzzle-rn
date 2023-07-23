import styled from 'styled-components/native';
import {Color} from '../../../constants/color.constant';

type Props = {
  letterSpacing?: number;
  fontWeight?: string | number;
  lineHeight?: number;
  color?: (typeof Color)[keyof typeof Color] | '#000000';
  fontSize?: number;
};

export const XXLargeText = styled.Text<Props>`
  color: ${props => (props.color ? props.color : '#000000')};
  font-size: 24px;
  font-weight: bold;
`;

export const XLargeText = styled.Text<Props>`
  color: ${props => (props.color ? props.color : '#000000')};
  font-size: 20px;
  font-weight: bold;
`;

export const LargeText = styled.Text<Props>`
  color: ${props => (props.color ? props.color : '#000000')};
  font-size: 18px;
`;

export const MediumText = styled.Text<Props>`
  color: ${props => (props.color ? props.color : '#000000')};
  font-size: 16px;
  font-weight: ${props => props.fontWeight || 'normal'};
`;

export const SmallText = styled.Text<Props>`
  color: ${props => (props.color ? props.color : '#000000')};
  font-size: 14px;
  font-weight: ${props => props.fontWeight || 'normal'};
  letter-spacing: ${({letterSpacing}) =>
    letterSpacing ? `${letterSpacing}px` : '0.25px'};
`;

export const XSmallText = styled.Text<Props>`
  color: ${props => (props.color ? props.color : '#000000')};
  font-size: 12px;
`;

function Text({...props}) {
  return <MediumText {...props} />;
}
export default Text;
