import style from '@ant-design/react-native/lib/accordion/style';
import {View} from 'react-native';
import styled from 'styled-components/native';
import {Color} from '../../../constants/color.constant';
import styles from '../../button/styles';

type Props = {
  color?: string;
};

export const Divider = styled.View<Props>`
  width: 100%;
  height: 8px;
  margin-bottom: 10px;
  background-color: ${Color.LIGHT_GRAY};
`;
