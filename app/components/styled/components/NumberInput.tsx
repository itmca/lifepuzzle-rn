import styled from 'styled-components/native';
import {TextInput as Input}  from 'react-native-paper';

type Props = {
  fontSize?: number;
  fontWeight: number|'bold',
  backgroundColor : string;
};

const StyledNumberInput = styled(Input).attrs(()=>({
  underlineColor:'transparent',
}))<Props>`
    fontSize: ${({ fontSize }) => (fontSize ? `${fontSize}px` : '24px')};
    fontWeight: ${({ fontWeight }) => (fontWeight ? `${fontWeight}px` : 'bold')};
    backgroundColor: ${({ backgroundColor }) => (backgroundColor ? `${backgroundColor}` : 'transparent')};
 `;

function NumberInput({ ...props }) {
  return (
    <StyledNumberInput {...props} >
    </StyledNumberInput>
  );
}
export default NumberInput;
