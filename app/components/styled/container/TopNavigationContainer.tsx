import styled, {css} from 'styled-components/native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {Platform} from 'react-native';
import {Color} from '../../../constants/color.constant';

const statusBarHeight = getStatusBarHeight();

export const TopNavigationContainer = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-bottom: 8px;
  padding-left: 20px;
  padding-right: 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${Color.GRAY};
  background-color: ${Color.WHITE};

  ${Platform.OS === 'ios'
    ? css`
        padding-top: ${statusBarHeight + 8}px;
      `
    : ''}
`;
