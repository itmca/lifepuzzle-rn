import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Color } from '../../../constants/color.constant';

export const TopNavigationContainer = styled(SafeAreaView)`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 50px;
  background-color: ${Color.WHITE};
`;
