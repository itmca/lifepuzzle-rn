import styled from 'styled-components/native';
import { Color } from '../../../constants/color.constant';

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
  justify-content: ${(props: Props) =>
    props.justifyContents ? props.justifyContents : 'flex-start'};
  align-items: ${(props: Props) =>
    props.alignItems ? props.alignItems : 'flex-start'};
  padding: ${(props: Props) => (props.selected ? '8px' : '12px')};
  height: auto;
  min-height: 59px;
  width: 100%;
  border-radius: 16px;
  background-color: ${(props: Props) =>
    props.backgroundColor ? props.backgroundColor : Color.WHITE};
  border-color: ${(props: Props) =>
    props.selected ? Color.MAIN_LIGHT : '#555555'};
  border-width: ${(props: Props) => (props.selected ? '5px' : '1px')};
  gap: ${(props: Props) => (props.gap ? props.gap : '0px')};
  margin-top: ${(props: Props) => (props.marginTop ? props.marginTop : '0px')};
  margin-bottom: ${(props: Props) =>
    props.marginBottom ? props.marginBottom : '8px'};
  box-sizing: border-box;
`;
