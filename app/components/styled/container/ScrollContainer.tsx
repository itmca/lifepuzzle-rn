import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import styled from 'styled-components/native';

type ScrollContainerProps = {
  gap?: string;
};

export const ScrollContainer = styled(
  KeyboardAwareScrollView,
)<ScrollContainerProps>`
  width: 100%;
`;
