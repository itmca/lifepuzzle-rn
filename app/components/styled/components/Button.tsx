import styled, {css} from 'styled-components/native';

type Props = {
  backgroundColor?: string;
  marginBottom?: string;
  marginTop?: string;
};

export const MediumButton = styled.TouchableOpacity<Props>`
  flex-direction: row;
  height: 48px;
  width: 100%;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  margin-top: ${props => (props.marginTop ? props.marginTop : '0px')};
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : '8px')};
  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : '#343666'};

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
