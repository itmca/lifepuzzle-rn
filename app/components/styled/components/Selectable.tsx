import styled from 'styled-components/native';
import {Color} from '../../../constants/color.constant';

type Props = {
  marginBottom?: string;
  marginTop?: string;
  backgroundColor?: string;
  gap?: number;
  justifyContents?: string;
  alignItems?: string;
  selected?: boolean;
};
export const WideSelectable = styled.TouchableOpacity<Props>`
  flex-direction: row;
  justify-content: ${props =>
    props.justifyContents ? props.justifyContents : 'flex-start'};
  align-items: ${props =>
    props.alignItems ? props.alignItems : 'flex-start'};;
  padding: 12px;
  height: auto;
  min-height: 59px;
  width: 100%;
  border-radius: 6px;
  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : Color.WHITE};
  border-color: ${props => (props.selected ? Color.ALERT_MEDIUM : 'none')}
  border-width: ${props => (props.selected ? '2px' : '0px')}
  gap: ${props => (props.gap ? props.gap : '0px')};
  margin-top: ${props => (props.marginTop ? props.marginTop : '0px')};
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : '8px')};
  disabled: true;
`;
