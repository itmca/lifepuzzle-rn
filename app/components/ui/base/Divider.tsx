import styled from 'styled-components/native';
import { Color } from '../../../constants/color.constant';

type Props = {
  color?: string;
  marginVertical?: number;
  paddingHorizontal?: number;
  height?: number;
};

export const Divider = styled.View<Props>`
  width: 100%;
  height: ${props => props.height ?? 1}px;
  margin-top: ${props => props.marginVertical ?? 16}px;
  margin-bottom: ${props => props.marginVertical ?? 16}px;
  padding-left: ${props => props.paddingHorizontal ?? 0}px;
  padding-right: ${props => props.paddingHorizontal ?? 0}px;
  background-color: ${Color.GREY};
  border-radius: 16px;
  ${props => props.color && `background-color: ${props.color};`}
`;
