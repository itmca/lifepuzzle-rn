import styled from 'styled-components/native';
type Color = '#F2C744'|'#55A5FD'|'#707070'|'#979797'|'#323232' |'#FFFFFF';
type Props = {
  fontFamily?:string;
  letterSpacing?: string;
  fontWeight?: string|number;
  lineHeight?: number;
  color?: Color|'#000000';
  fontSize?: number;
};

export const XLargeTitle = styled.Text<Props>`
   color: ${props => (props.color ? props.color : '#000000')};
   fontSize: 32px;
   fontWeight: bold;
 `;

export const LargeTitle = styled.Text<Props>`
    color: ${props => (props.color ? props.color : '#000000')};
    fontSize: 24px;
 `;

export const MediumTitle = styled.Text<Props>`
    color: ${props => (props.color ? props.color : '#000000')};
    fontSize: 20px;
 `;
export const SmallTitle = styled.Text<Props>`
   color: ${props => (props.color ? props.color : '#000000')};
   fontSize: 13px;
   fontWeight: ${props => props.fontWeight || 'normal'};
   letterSpacing: ${({ letterSpacing }) => (letterSpacing ? `${letterSpacing}px` : '0.25px')};
 `;

export const XSmallTitle = styled.Text<Props>`
   color: ${props => (props.color ? props.color : '#000000')};
   fontSize: 11px;
 `;

function Title({ ...props }) {
  return (
    <MediumTitle {...props}/>
  );
}
export default Title;

