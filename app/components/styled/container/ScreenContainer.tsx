import styled from 'styled-components/native';

type ScreenContainerProps = {
  flexDirections?: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
};

export const ScreenContainer = styled.SafeAreaView<ScreenContainerProps>`
  box-sizing: border-box;
  border: 16px solid #ffffff00;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: ${props =>
    props.flexDirections ? props.flexDirections : 'column'};
  justify-content: ${props =>
    props.justifyContent ? props.justifyContent : 'center'};
  align-items: ${props => (props.alignItems ? props.alignItems : 'center')};
  align-content: space-around;
  gap: ${props => (props.gap ? props.gap : '16px')};
`;

export const NoOutLineScreenContainer = styled.SafeAreaView`
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
`;

export const NoOutLineFullScreenContainer = styled.View`
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
`;
