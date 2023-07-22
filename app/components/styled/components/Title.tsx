import styled from 'styled-components/native';
import {Color} from '../../../constants/color.constant';

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
  color: ${props => (props.color ? props.color : Color.BLACK)};
  fontsize: 32px;
  fontweight: 700;
`;

export const LargeTitle = styled.Text<Props>`
  color: ${props => (props.color ? props.color : Color.BLACK)};
  fontsize: 24px;
  fontweight: 700;
`;

export const MediumTitle = styled.Text<Props>`
  color: ${props => (props.color ? props.color : Color.BLACK)};
  fontsize: 20px;
  fontweight: 700;
`;
export const SmallTitle = styled.Text<Props>`
  color: ${props => (props.color ? props.color : Color.BLACK)};
  fontsize: 18px;
  fontweight: 700;
  letterspacing: ${({letterSpacing}) =>
    letterSpacing ? `${letterSpacing}px` : '0.25px'};
`;

export const XSmallTitle = styled.Text<Props>`
  color: ${props => (props.color ? props.color : Color.BLACK)};
  fontweight: 700;
  fontsize: 16px;
`;

function Title({...props}) {
  return <MediumTitle {...props} />;
}

export default Title;
