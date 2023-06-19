import styled from 'styled-components/native';
import React from 'react';

type Props = {
  height?: number;
};

export const KeyboardContainer = styled.View<Props>`
  width: 100%;
  height: ${({height}) => (height ? `${height}px` : '56px')};
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
  position: absolute;
  bottom: 0px;
  border-width: 1px;
  border-color: #dbd6d6;
  vertical-align: middle;
`;
export const VerticalLine = styled.View`
  height: 50%;
  width: 1px;
  background-color: #e6e6e6;
  align-self: center;
`;
