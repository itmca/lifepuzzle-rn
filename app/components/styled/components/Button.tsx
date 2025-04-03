import styled, {css} from 'styled-components/native';
import {Color, ColorType} from '../../../constants/color.constant';

type Props = {
  // Size
  height?: string;
  width?: string;

  // Layout
  gap?: number;

  // Padding
  paddingVertical?: number;
  paddingHorizontal?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;

  // Background & Border
  backgroundColor?: ColorType;
  borderColor?: ColorType;
  borderRadius?: number;
  borderWidth?: number;
  borderInside?: boolean;
};

export const ButtonBase = styled.TouchableOpacity<Props>`
  /* Size */
  height: ${props => props.height ?? '56px'};
  width: ${props => props.width ?? '100%'};

  /* Layout */
  flex-direction: row;
  justify-content: center;
  align-items: center;
  ${props => (props.gap ? `gap: ${props.gap}px` : '')};
  ${props => (props.width === 'auto' ? 'align-self: flex-start' : '')};

  ${props =>
    props.paddingVertical !== undefined &&
    css`
      padding-top: ${props.paddingVertical}px;
      padding-bottom: ${props.paddingVertical}px;
    `}
  ${props =>
    props.paddingTop !== undefined &&
    css`
      padding-top: ${props.paddingTop}px;
    `}
  ${props =>
    props.paddingBottom !== undefined &&
    css`
      padding-bottom: ${props.paddingBottom}px;
    `}
  ${props =>
    props.paddingHorizontal !== undefined &&
    css`
      padding-top: ${props.paddingHorizontal}px;
      padding-bottom: ${props.paddingHorizontal}px;
    `}
  ${props =>
    props.paddingLeft !== undefined &&
    css`
      padding-left: ${props.paddingLeft}px;
    `}
  ${props =>
    props.paddingRight !== undefined &&
    css`
      padding-right: ${props.paddingRight}px;
    `}
  
  /* Background & Border */
  background-color: ${props => props.backgroundColor ?? Color.MAIN_DARK};
  background-color: ${props => props.backgroundColor ?? Color.MAIN_DARK};
  border-color: ${props => props.borderColor ?? Color.TRANSPARENT};
  border-radius: ${props => props.borderRadius ?? 6}px;
  border-width: ${props => props.borderWidth ?? 0}px;
  ${props => (props.borderInside ? 'box-sizing: border-box' : '')};
`;

// TODO(jung.jooon): 2025년 03월 디자인 개편 이후 해당 라인 이하 삭제 예정
type LegacyProps = {
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

export const MediumButton = styled.TouchableOpacity<LegacyProps>`
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
      background-color: ${Color.GREY_200};
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

export const LargeButton = styled.TouchableOpacity<LegacyProps>`
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

export const LargeWideButton = styled.TouchableOpacity<LegacyProps>`
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

export const ImageButton = styled.TouchableOpacity<LegacyProps>`
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
