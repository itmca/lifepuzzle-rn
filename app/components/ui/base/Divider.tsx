import styled from 'styled-components/native';
import {Color} from '../../../constants/color.constant';

type Props = {
  color?: string;
  marginVertical?: number;
};

export const Divider = styled.View<Props>`
  width: 100%;
  height: 1px;
  margin-top: ${props => props.marginVertical ?? 16}px;
  margin-bottom: ${props => props.marginVertical ?? 16}px;
  background-color: ${Color.GREY};
  border-radius: 16px;
  ${props => props.color && `background-color: ${props.color};`}
`;
