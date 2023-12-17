import styled from 'styled-components/native';
import {Color} from '../../../constants/color.constant';

type Props = {
  fontFamily?: string;
  letterSpacing?: string;
  fontWeight?: string | number;
  lineHeight?: string | number;
  color?: string | '#000000';
  left?: number;
  fontSize?: number;
};

export const XLargeTitle = styled.Text<Props>`
  font-family: 'Pretendard';
  color: ${props => (props.color ? props.color : Color.BLACK)};
  font-size: 32px;
  font-weight: 700;
`;

export const LargeTitle = styled.Text<Props>`
  font-family: 'Pretendard';
  color: ${props => (props.color ? props.color : Color.BLACK)};
  font-size: 24px;
  font-weight: 700;
  line-height: ${props => (props.lineHeight ? props.lineHeight : '29px')};
`;

export const MediumTitle = styled.Text<Props>`
  font-family: 'Pretendard';
  color: ${props => (props.color ? props.color : Color.BLACK)};
  font-size: 20px;
  font-weight: 700;
`;

export const SmallTitle = styled.Text<Props>`
  font-family: 'Pretendard';
  color: ${props => (props.color ? props.color : Color.BLACK)};
  font-size: 18px;
  font-weight: 700;
  letter-spacing: ${({letterSpacing}) =>
    letterSpacing ? `${letterSpacing}px` : '0.25px'};
`;

export const XSmallTitle = styled.Text<Props>`
  font-family: 'Pretendard';
  left: ${props => (props.left ? props.left + 'px' : 0)};
  color: ${props => (props.color ? props.color : Color.BLACK)};
  font-weight: ${props => (props.fontWeight ? props.fontWeight : '700')};
  font-size: 16px;
`;

function Title({...props}) {
  return <MediumTitle {...props} />;
}

export default Title;
