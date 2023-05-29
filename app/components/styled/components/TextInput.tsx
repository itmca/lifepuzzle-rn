import styled from 'styled-components/native';
import {TextInput}  from 'react-native-paper';
type Props = {
  width?: number;
  marginBottom?: number;
  fontSize?: number;
  fontWeight: number|'bold',
  backgroundColor : string;
};

const StyledTextInput = styled(TextInput).attrs(()=>({
  underlineColor:'transparent',
}))<Props>`
    width: ${({ width }) => (width ? `${width}%` : '100%')};
    marginBottom: ${({ marginBottom }) => (marginBottom ? `${marginBottom}px` : '8px')};
    fontSize: ${({ fontSize }) => (fontSize ? `${fontSize}px` : '16px')};
    fontWeight: ${({ fontWeight }) => (fontWeight ? `${fontWeight}px` : 'bold')};
    backgroundColor: ${({ backgroundColor }) => (backgroundColor ? `${backgroundColor}` : 'transparent')};

 `;
function Input({ ...props }) {

  return (
      <StyledTextInput {...props} >
      </StyledTextInput>
  );
}
export default Input;
