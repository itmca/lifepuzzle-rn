import styled from 'styled-components/native';
import {Color} from '../../../constants/color.constant';

type Props = {
  color?: string;
};

export const Divider = styled.View<Props>`
  width: 100%;
  height: 1px;
  background-color: ${Color.GREY};
  border-radius: 16px;
  ${props => props.color && `background-color: ${props.color};`}
`;
