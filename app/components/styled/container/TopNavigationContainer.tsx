import styled, {css} from 'styled-components/native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {Platform} from 'react-native';
import {Color} from '../../../constants/color.constant';

const statusBarHeight = getStatusBarHeight();

export const TopNavigationContainer = styled.View`
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 16px;
  padding-right: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${Color.GRAY};
  background-color: ${Color.WHITE};

  ${Platform.OS === 'ios'
    ? css`
        margin-top: ${statusBarHeight}px;
      `
    : ''}
`;
