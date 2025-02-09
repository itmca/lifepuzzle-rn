import styled from 'styled-components/native';
import {LegacyColor} from '../../../constants/color.constant';

export const TopNavigationContainer = styled.SafeAreaView`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 56px;
  border-bottom-width: 1px;
  border-bottom-color: ${LegacyColor.GRAY};
  background-color: ${LegacyColor.WHITE};
`;
