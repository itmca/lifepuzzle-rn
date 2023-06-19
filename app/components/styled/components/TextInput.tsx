import styled, {css} from 'styled-components/native';
import {TextInput} from 'react-native-paper';
import {useEffect, useState} from 'react';
import {XSmallText} from './Text';
import {
  NativeSyntheticEvent,
  TextInputChangeEventData,
  View,
} from 'react-native';
import {ContentContainer} from '../container/ContentContainer';
type Props = {
  width?: number;
  marginBottom?: number;
  fontSize?: number;
  fontWeight?: number | 'normal';
  backgroundColor?: string;
};

const StyledTextInput = styled(TextInput).attrs(() => ({
  underlineColor: 'transparent',
  activeUnderlineColor: 'transparent',
  outlineStyle: {borderWidth: 1, borderRadius: 8},
  outlineColor: '#D9D9D9',
  activeOutlineColor: '#32C5FF',
  selectionColor: '#32C5FF',
  activeBackgroundColor: '#F7FDFF',
}))<Props>`
  width: ${props => (props.width ? `${props.width}%` : 'auto')};
  margin-bottom: ${props =>
    props.marginBottom ? `${props.marginBottom}px` : '8px'};
  font-size: ${props => (props.fontSize ? `${props.fontSize}px` : '16px')};
  font-weight: ${props =>
    props.fontWeight ? `${props.fontWeight}px` : 'normal'};
  background-color: ${props =>
    props.backgroundColor ? `${props.backgroundColor}` : 'transparent'};
`;
function Input({...props}) {
  const [inputCount, setInputCount] = useState(0);
  const onChangeInputCount = (
    event: NativeSyntheticEvent<TextInputChangeEventData>,
  ) => {
    const {text} = event.nativeEvent;
    setInputCount(text.length);
    return false;
  };
  return (
    <ContentContainer>
      <StyledTextInput
        onChange={onChangeInputCount}
        {...props}></StyledTextInput>
      {props.maxLength != undefined && (
        <XSmallText style={{position: 'absolute', right: 20, bottom: 20}}>
          {inputCount}/500
        </XSmallText>
      )}
    </ContentContainer>
  );
}
export default Input;
