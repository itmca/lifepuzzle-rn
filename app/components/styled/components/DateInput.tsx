import styled from 'styled-components/native';
import {DatePickerInput as Input}  from 'react-native-paper-dates';

type Props = {
  width?: '100%';
  marginBottom?: number|8;
};

const StyledDateInput = styled(Input).attrs(()=>({
  locale:'en',
  inputMode:'start',
  mode:'outlined'
}))<Props>`
    width: ${({ width }) => (width ? `${width}%` : '100%')};
    marginBottom: ${({ marginBottom }) => (marginBottom ? `${marginBottom}px` : '8px')};
 `;

function DateInput({ ...props }) {

  return (
    <StyledDateInput {...props} >
    </StyledDateInput>
  );
}
export default DateInput;
