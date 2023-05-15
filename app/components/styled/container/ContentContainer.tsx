import styled from 'styled-components/native';

type Props = {
  flex: number;
};

export const ContentContainer = styled.View<Props>`
  width: 100%;
  flex: ${props => (props.flex ? props.flex : 1)};
  justify-content: flex-start;
  align-items: center;
`;
