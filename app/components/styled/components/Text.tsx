import styled from 'styled-components/native';

type Color =
  | '#F2C744'
  | '#55A5FD'
  | '#707070'
  | '#979797'
  | '#323232'
  | '#FFFFFF'
  | '#A9A9A9'
  | '#32C5FF'
  | '#FF6200';

type Props = {
  letterSpacing?: number;
  fontWeight?: string | number;
  lineHeight?: number;
  color?: Color | '#000000';
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
