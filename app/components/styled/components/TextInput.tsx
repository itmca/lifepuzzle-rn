import styled from 'styled-components/native';
import {TextInput as Input}  from 'react-native-paper';
type Props = {
  width?: number;
  marginBottom?: number;
};

const StyledTextInput = styled(Input).attrs(()=>({
  underlineColor:'transparent',
}))<Props>`
    width: ${({ width }) => (width ? `${width}%` : '100%')};
    marginBottom: ${({ marginBottom }) => (marginBottom ? `${marginBottom}px` : '8px')};
 `;
function TextInput({ ...props }) {

  return (
      <StyledTextInput {...props} >
      </StyledTextInput>
  );
}
export default TextInput;
