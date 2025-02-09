import styled from 'styled-components/native';
import {LegacyColor} from '../../../constants/color.constant';

type Props = {
  color?: string;
};

export const Divider = styled.View<Props>`
  width: 100%;
  height: 8px;
  margin-bottom: 10px;
  background-color: ${LegacyColor.GRAY};
  border-radius: 16px;
  ${props => props.color && `background-color: ${props.color};`}
`;
