import styled from 'styled-components/native';
import {Color} from '../../../constants/color.constant';

type ScreenContainerProps = {
  flexDirections?: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  padding?: number | string;
};

export const ScreenContainer = styled.SafeAreaView<ScreenContainerProps>`
  width: 100%;
  height: 100%;
  display: flex;
  box-sizing: border-box;
  border: 16px solid #ffffff00;
  background-color: ${Color.WHITE};
  gap: ${props => props.gap ?? '16px'};
  flex-direction: ${props => props.flexDirections ?? 'column'};
  justify-content: ${props => props.justifyContent ?? 'center'};
  align-items: ${props => props.alignItems ?? 'center'};
  align-content: space-around;
`;

export const NoOutLineScreenContainer = styled.SafeAreaView<ScreenContainerProps>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: ${props => props.justifyContent ?? 'center'};
  background-color: ${Color.WHITE};
  padding: ${props => props.padding ?? '0px'};
`;

export const NoOutLineFullScreenContainer = styled.View`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${Color.WHITE};
`;
