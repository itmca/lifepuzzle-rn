import styled from 'styled-components/native';
import { Color } from '../../../constants/color.constant';

type Props = {
  color?: string;
};

export const Dot = styled.View<Props>`
  width: 6px;
  height: 6px;
  background-color: ${Color.GREY_200};
  border-radius: 6px;
`;
export const ActiveDot = styled.View<Props>`
  width: 8px;
  height: 8px;
  background-color: ${Color.MAIN};
  border-radius: 8px;
`;
