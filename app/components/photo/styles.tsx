import styled from 'styled-components/native';

export const Container = styled.View``;

export const CheckCover = styled.View`
  position: absolute;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  opacity: 0.5;
  background-color: black;
  padding: 5px;
`;

export const BlackContainer = styled.View`
  position: absolute;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  opacity: 0.5;
  background-color: black;
  padding: 5px;
`;

export const TopDescriptionWrap = styled.View`
  width: 100%;
  height: 48px;
  background-color: rgba(147, 176, 208, 0.2);
  text-align: center;
  justify-content: center;
  padding: 0 20px;
`;

export const TopDescriptionText = styled.Text`
  color: #323232;
  font-size: 12px;
  font-weight: bold;
`;
