import styled, {css} from 'styled-components/native';
import {Color} from '../../../constants/color.constant';

type Props = {
  mode?: string;
  width?: string;
  height?: string;
  flexBasis?: string;
  backgroundColor?: string;
  marginBottom?: string;
  marginTop?: string;
  marginLeft?: string;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  justifyContent?: string;
  padding?: string;
  alignSelf?: string;
};

export const MediumButton = styled.TouchableOpacity<Props>`
  flex-direction: row;
  flex-basis: ${props => (props.flexBasis ? props.flexBasis : 'auto')};
  height: ${props => props.height ?? '52px'};
  width: ${props => (props.width ? props.width : '100%')};
  justify-content: ${props =>
    props.justifyContent ? props.justifyContent : 'center'};
  align-items: center;

  ${props =>
    props.borderTopLeftRadius &&
    `border-top-left-radius: ${props.borderTopLeftRadius}px;`};
  ${props =>
    props.borderTopRightRadius &&
    `border-top-right-radius: ${props.borderTopLeftRadius}px;`};
  ${props =>
    props.borderBottomLeftRadius &&
    `border-bottom-left-radius: ${props.borderBottomLeftRadius}px;`};
  ${props =>
    props.borderBottomRightRadius &&
    `border-bottom-right-radius: ${props.borderBottomRightRadius}px;`};
  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : '#343666'};
  padding: ${props => (props.padding ? props.padding : '0px')};
  align-self: ${props => (props.alignSelf ? props.alignSelf : 'auto')};

  border-width: ${props => (props.borderWidth ? props.borderWidth + 'px' : 0)};
  border-color: ${props => (props.borderColor ? props.borderColor : 0)};
  ${props =>
    props.disabled &&
    css`
      background-color: ${Color.GRAY};
    `};
  ${props =>
    props.borderRadius &&
    css`
      border-top-left-radius: ${props.borderRadius}px;
      border-top-right-radius: ${props.borderRadius}px;
      border-bottom-left-radius: ${props.borderRadius}px;
      border-bottom-right-radius: ${props.borderRadius}px;
    `};
`;

export const LargeButton = styled.TouchableOpacity<Props>`
  height: 48px;
  width: 128px;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : '#32C5FF'};

  ${props =>
    props.disabled &&
    css`
      background-color: #eeeeee;
      color: #d9d9d9;
    `};
`;

export const LargeWideButton = styled.TouchableOpacity<Props>`
  height: 48px;
  width: 100%;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : '#32C5FF'};

  ${props =>
    props.disabled &&
    css`
      background-color: #eeeeee;
      color: #d9d9d9;
    `};
`;

export const ImageButton = styled.TouchableOpacity<Props>`
  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : 'black'};
  width: ${props => (props.width ? props.width : '100%')};
  justify-content: ${props =>
    props.justifyContent ? props.justifyContent : 'center'};
  height:${props => (props.height ? props.height : 'auto')}
  borderRadius:${props =>
    props.borderRadius ? props.borderRadius + 'px' : '0'}
  align-items: center;
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : '8px')};
  margin-left: ${props => (props.marginLeft ? props.marginLeft : '0px')};
`;
