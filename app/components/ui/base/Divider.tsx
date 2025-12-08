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
  height: ${(props: Props) => props.height ?? 1}px;
  margin-top: ${(props: Props) => props.marginVertical ?? 16}px;
  margin-bottom: ${(props: Props) => props.marginVertical ?? 16}px;
  padding-left: ${(props: Props) => props.paddingHorizontal ?? 0}px;
  padding-right: ${(props: Props) => props.paddingHorizontal ?? 0}px;
  background-color: ${Color.GREY};
  border-radius: 16px;
  ${(props: Props) => props.color && `background-color: ${props.color};`}
`;
