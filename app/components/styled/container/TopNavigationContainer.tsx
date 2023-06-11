import styled, {css} from 'styled-components/native';
import {getStatusBarHeight} from 'react-native-status-bar-height';

export const TopNavigationContainer = styled.View`
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: ${getStatusBarHeight()}px;
  padding-left: 16px;
  padding-right: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #d9d9d9;
`;
