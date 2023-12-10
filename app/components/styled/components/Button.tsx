import styled, {css} from 'styled-components/native';

type Props = {
  width?: string;
  flexBasis?: string;
  backgroundColor?: string;
  marginBottom?: string;
  marginTop?: string;
  borderWidth?: number;
  borderColor?: string;
  borderTopLeftRadius?: string;
  borderTopRightRadius?: string;
  borderBottomLeftRadius?: string;
  borderBottomRightRadius?: string;
};

export const MediumButton = styled.TouchableOpacity<Props>`
  flex-direction: row;
  flex-basis: ${props => (props.flexBasis ? props.flexBasis : 'auto')};
  height: 48px;
  width: ${props => (props.width ? props.width : '100%')};
  justify-content: center;
  align-items: center;
  border-top-left-radius: ${props =>
    props.borderTopLeftRadius ? props.borderTopLeftRadius : '4px'};
  border-top-right-radius: ${props =>
    props.borderTopRightRadius ? props.borderTopRightRadius : '4px'};
  border-bottom-left-radius: ${props =>
    props.borderBottomLeftRadius ? props.borderBottomLeftRadius : '4px'};
  border-bottom-right-radius: ${props =>
    props.borderBottomRightRadius ? props.borderBottomRightRadius : '4px'};
  margin-top: ${props => (props.marginTop ? props.marginTop : '0px')};
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : '8px')};
  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : '#343666'};
  border-width: ${props => (props.borderWidth ? props.borderWidth + 'px' : 0)};
  border-color: ${props => (props.borderColor ? props.borderColor : 0)};
  ${props =>
    props.disabled &&
    css`
      background-color: grey;
    `};
`;

export const LargeButton = styled.TouchableOpacity<Props>`
  height: 48px;
  width: 128px;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : '#32C5FF'};

  ${props =>
    props.disabled &&
    css`
      background-color: #eeeeee;
      color: #d9d9d9;
    `};
`;

export const LargeWideButton = styled.TouchableOpacity<Props>`
  height: 48px;
  width: 100%;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : '#32C5FF'};

  ${props =>
    props.disabled &&
    css`
      background-color: #eeeeee;
      color: #d9d9d9;
    `};
`;

export const ImageButton = styled.TouchableOpacity<Props>`
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
`;
