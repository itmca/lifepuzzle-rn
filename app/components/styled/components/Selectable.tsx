import styled from 'styled-components/native';
import {LegacyColor} from '../../../constants/color.constant';

type Props = {
  marginBottom?: string;
  marginTop?: string;
  backgroundColor?: string;
  borderColor?: string;
  gap?: string;
  justifyContents?: string;
  alignItems?: string;
  selected?: boolean;
};
export const WideSelectable = styled.TouchableOpacity<Props>`
  flex-direction: row;
  justify-content: ${props =>
    props.justifyContents ? props.justifyContents : 'flex-start'};
  align-items: ${props => (props.alignItems ? props.alignItems : 'flex-start')};
  padding: ${props => (props.selected ? '8px' : '12px')};
  height: auto;
  min-height: 59px;
  width: 100%;
  border-radius: 16px;
  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : LegacyColor.WHITE};
  border-color: ${props =>
    props.selected ? LegacyColor.PRIMARY_LIGHT : '#555555'};
  border-width: ${props => (props.selected ? '5px' : '1px')};
  gap: ${props => (props.gap ? props.gap : '0px')};
  margin-top: ${props => (props.marginTop ? props.marginTop : '0px')};
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : '8px')};
  box-sizing: border-box;
`;
