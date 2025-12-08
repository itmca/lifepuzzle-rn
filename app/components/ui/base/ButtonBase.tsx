import styled, { css } from 'styled-components/native';
import { Color, ColorType } from '../../../constants/color.constant';
import { SizeValue } from '../../../types/ui/style.type';
import { formatSize } from '../../../utils/style.util.ts';

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
  height: ${(props: Props) => formatSize(props.height, '56px')};
  width: ${(props: Props) => formatSize(props.width, '100%')};

  /* Layout */
  flex-direction: row;
  justify-content: center;
  align-items: center;
  ${(props: Props) => (props.gap ? `gap: ${props.gap}px;` : '')};
  ${(props: Props) =>
    props.width === 'auto' ? 'align-self: flex-start;' : ''};

  ${(props: Props) =>
    props.paddingVertical !== undefined &&
    css`
      padding-top: ${props.paddingVertical}px;
      padding-bottom: ${props.paddingVertical}px;
    `}
  ${(props: Props) =>
    props.paddingTop !== undefined &&
    css`
      padding-top: ${props.paddingTop}px;
    `}
  ${(props: Props) =>
    props.paddingBottom !== undefined &&
    css`
      padding-bottom: ${props.paddingBottom}px;
    `}
  ${(props: Props) =>
    props.paddingHorizontal !== undefined &&
    css`
      padding-left: ${props.paddingHorizontal}px;
      padding-right: ${props.paddingHorizontal}px;
    `}
  ${(props: Props) =>
    props.paddingLeft !== undefined &&
    css`
      padding-left: ${props.paddingLeft}px;
    `}
  ${(props: Props) =>
    props.paddingRight !== undefined &&
    css`
      padding-right: ${props.paddingRight}px;
    `}

  /* Background & Border */
  background-color: ${(props: Props) =>
    props.backgroundColor ?? Color.MAIN_DARK};
  border-color: ${(props: Props) => props.borderColor ?? Color.TRANSPARENT};
  border-radius: ${(props: Props) => props.borderRadius ?? 6}px;
  border-width: ${(props: Props) => props.borderWidth ?? 0}px;
  ${(props: Props) => (props.borderInside ? 'box-sizing: border-box;' : '')};
`;
