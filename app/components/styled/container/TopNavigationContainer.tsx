import styled from 'styled-components/native';

type Props = {
  width?: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  flex?: number | string;
};

export const TopNavigationContainer = styled.View<Props>`
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #d9d9d9;
`;
