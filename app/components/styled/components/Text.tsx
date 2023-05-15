import styled from 'styled-components/native';

type Color = '#F2C744'|'#55A5FD'|'#707070'|'#979797'|'#323232' |'#FFFFFF';
type Props = {
  letterSpacing?: string;
  fontWeight?: string|number;
  lineHeight?: number;
  color?: Color|'#000000';
  fontSize?: number;
};

export const XLargeText = styled.Text<Props>`
   fontSize: 32px;
   fontWeight: bold;
 `;

export const LargeText = styled.Text<Props>`
    color: ${props => (props.color ? props.color : '#000000')};
    fontSize: 24px;
 `;

export const MediumText = styled.Text<Props>`
    color: ${props => (props.color ? props.color : '#000000')};
    fontSize: 20px;
 `;

export const SmallText = styled.Text<Props>`
   color: ${props => (props.color ? props.color : '#000000')};
   fontSize: 13px;
   fontWeight: ${props => props.fontWeight || 'normal'};
   letterSpacing: ${props => props.letterSpacing || '0.15px'};
 `;

export const XSmallText = styled.Text<Props>`
   color: ${props => (props.color ? props.color : '#000000')};
   fontSize: 11px;
 `;