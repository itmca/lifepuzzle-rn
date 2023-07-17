import styled from 'styled-components/native';

type Color =
  | '#F2C744'
  | '#55A5FD'
  | '#707070'
  | '#979797'
  | '#323232'
  | '#FFFFFF';
type Props = {
  fontFamily?: string;
  letterSpacing?: string;
  fontWeight?: string | number;
  lineHeight?: number;
  color?: Color | '#000000';
  fontSize?: number;
};

export const XLargeTitle = styled.Text<Props>`
  color: ${props => (props.color ? props.color : '#000000')};
  font-size: 32px;
  font-weight: 700;
`;

export const LargeTitle = styled.Text<Props>`
  color: ${props => (props.color ? props.color : '#000000')};
  font-size: 24px;
  font-weight: 700;
`;

export const MediumTitle = styled.Text<Props>`
  color: ${props => (props.color ? props.color : '#000000')};
  font-size: 20px;
  font-weight: 700;
`;
export const SmallTitle = styled.Text<Props>`
  color: ${props => (props.color ? props.color : '#000000')};
  font-size: 18px;
  font-weight: 700;
  letterspacing: ${({letterSpacing}) =>
    letterSpacing ? `${letterSpacing}px` : '0.25px'};
`;

export const XSmallTitle = styled.Text<Props>`
  color: ${props => (props.color ? props.color : '#000000')};
  font-weight: 700;
  font-size: 16px;
`;

function Title({...props}) {
  return <MediumTitle {...props} />;
}

export default Title;
