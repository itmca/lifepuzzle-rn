import styled from 'styled-components/native';

export const ScreenContainer = styled.SafeAreaView`
  box-sizing: border-box;
  border: 16px solid #ffffff00;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: space-around;
  gap: 16px;
`;

export const NoOutLineScreenContainer = styled.SafeAreaView`
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
`;
