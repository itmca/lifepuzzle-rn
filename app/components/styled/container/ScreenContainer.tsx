import styled from 'styled-components/native';
import {LegacyColor} from '../../../constants/color.constant';

type ScreenContainerProps = {
  flexDirections?: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: number;

  // Border & Shadow
  withUpperShadow?: boolean;
  withBorder?: boolean;
  withDebugBorder?: boolean;
  borderRadius?: number;
};

export const ScreenContainer = styled.SafeAreaView<ScreenContainerProps>`
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  background-color: ${LegacyColor.WHITE};
  gap: ${props => props.gap ?? 16}px;
  flex-direction: ${'column'};
  justify-content: ${'stretch'};
  align-items: ${'center'};
  align-content: space-around;

  /* Border & Shadow */
  ${props => props.withUpperShadow && 'box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);'}
  ${props => props.withBorder && `border: 1px solid ${LegacyColor.GRAY};`}
  ${props => props.withDebugBorder && 'border: 1px solid red;'}
  border-radius: ${props => props.borderRadius ?? 0}px;
`;
