import styled, {css} from 'styled-components/native';

type Props = {
  backgroundColor?: string;
};

export const MediumButton = styled.TouchableOpacity<Props>`
  flex-direction: row;
  height: 48;
  width: 100%;
  justify-content: center;
  align-items: center;
  border-radius: 4;
  margin-bottom: 8;
  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : '#343666'};

  ${props =>
    props.disabled &&
    css`
      backgroud-color: grey;
    `};
`;
