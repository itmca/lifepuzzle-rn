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
  flexdirection: row;
  position: absolute;
  bottom: 0px;
  borderwidth: 1px;
  bordercolor: #dbd6d6;
  verticalalign: middle;
`;
export const VerticalLine = styled.View`
  height: 50%;
  width: 1px;
  backgroundcolor: #e6e6e6;
  alignself: center;
`;
