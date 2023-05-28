import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import styled from 'styled-components/native';

type Props = {
  gap?: string;
};

export const ScrollContainer = styled(KeyboardAwareScrollView)<Props>`
  width: 100%;
`;
