import styled, { css } from 'styled-components/native';
import { Color, ColorType } from '../../../constants/color.constant';
import { SizeValue } from '../../../types/ui/style.type';
import { formatSize } from '../../../service/utils/style.service';

type Props = {
  // Size
  height?: SizeValue;
  width?: SizeValue;

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
  height: ${props => formatSize(props.height, '56px')};
  width: ${props => formatSize(props.width, '100%')};

  /* Layout */
  flex-direction: row;
  justify-content: center;
  align-items: center;
  ${props => (props.gap ? `gap: ${props.gap}px;` : '')};
  ${props => (props.width === 'auto' ? 'align-self: flex-start;' : '')};

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
      padding-left: ${props.paddingHorizontal}px;
      padding-right: ${props.paddingHorizontal}px;
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
  border-color: ${props => props.borderColor ?? Color.TRANSPARENT};
  border-radius: ${props => props.borderRadius ?? 6}px;
  border-width: ${props => props.borderWidth ?? 0}px;
  ${props => (props.borderInside ? 'box-sizing: border-box;' : '')};
`;
