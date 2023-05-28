import React from 'react';
import styled from 'styled-components/native';

type Color = '#000000' |'#FFFFFF';
type Props = {
  color?: Color;
};
export const StyledLabel = styled.View<Props>`
  color: ${props => (props.color ? props.color : '#000000')};
`;
function Label({ ...props }) {

  return (
    <StyledLabel {...props} >
    </StyledLabel>
  );
}
export default Label;

