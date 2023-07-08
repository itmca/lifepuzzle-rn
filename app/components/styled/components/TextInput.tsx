import styled from 'styled-components/native';
import {TextInput} from 'react-native-paper';
import {useState} from 'react';
import {XSmallText} from './Text';
import {NativeSyntheticEvent, TextInputChangeEventData} from 'react-native';
import {ContentContainer} from '../container/ContentContainer';

type Props = {
  width?: number;
  fontSize?: number;
  fontWeight?: number | 'normal';
};

const StyledTextInput = styled(TextInput).attrs(props => ({
  outlineStyle: {borderWidth: 1},
  right: props.right,
}))<Props>`
  width: ${props => (props.width ? `${props.width}%` : 'auto')};
  font-size: ${props => (props.fontSize ? `${props.fontSize}px` : '16px')};
  font-weight: ${props =>
    props.fontWeight ? `${props.fontWeight}px` : 'normal'};
`;

function Input({...props}) {
  const [inputCount, setInputCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const onChangeInputCount = (
    event: NativeSyntheticEvent<TextInputChangeEventData>,
  ) => {
    const {text} = event.nativeEvent;
    setInputCount(text.length);
    return false;
  };
  const theme = {
    roundness: 8,
    colors: {
      primary: '#32C5FF',
      secondary: '#32C5FF',
      outline: '#D9D9D9',
      onSurface: 'black', //underline, textColor
      surfaceVariant: 'transparent', //underlineBackground
      background: isFocused == true ? '#F7FDFF' : '#FFFFFF',
    },
    fonts: {
      fontFamily: 'Pretendard Regular',
    },
  };
  return (
    <ContentContainer>
      <StyledTextInput
        theme={theme}
        onChange={onChangeInputCount}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
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
