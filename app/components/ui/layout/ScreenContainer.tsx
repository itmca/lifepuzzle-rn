import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Color } from '../../../constants/color.constant';
import { Edge } from 'react-native-safe-area-context';

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

  // Safe Area
  edges?: ReadonlyArray<Edge>;
};

export const ScreenContainer = styled(SafeAreaView).attrs<ScreenContainerProps>(
  (props: ScreenContainerProps) => ({
    edges: props.edges,
  }),
)<ScreenContainerProps>`
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  background-color: ${Color.WHITE};
  gap: ${(props: ScreenContainerProps) => props.gap ?? 16}px;
  flex-direction: ${'column'};
  justify-content: ${'stretch'};
  align-items: ${'center'};
  align-content: space-around;

  /* Border & Shadow */
  ${(props: ScreenContainerProps) =>
    props.withUpperShadow && 'box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);'}
  ${(props: ScreenContainerProps) =>
    props.withBorder && `border: 1px solid ${Color.GREY};`}
  ${(props: ScreenContainerProps) =>
    props.withDebugBorder && 'border: 1px solid red;'}
  border-radius: ${(props: ScreenContainerProps) => props.borderRadius ?? 0}px;
`;
