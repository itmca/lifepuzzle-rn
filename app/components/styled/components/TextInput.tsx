import styled from 'styled-components/native';
import {TextInput} from 'react-native-paper';
import React, {useState} from 'react';
import {XSmallText} from './Text';
import {NativeSyntheticEvent, TextInputChangeEventData} from 'react-native';
import {Color} from '../../../constants/color.constant';

type Props = {
  width?: number;
  fontSize?: number;
  fontWeight?: number | 'normal';
};

const StyledTextInput = styled(TextInput).attrs(props => ({
  outlineStyle: {borderWidth: 1},
  right: props.right,
}))<Props>`
  width: ${props => (props.width ? `${props.width}%` : '100%')};
  fontsize: ${props => (props.fontSize ? `${props.fontSize}px` : '16px')};
  fontweight: ${props =>
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
    roundness: 4,
    colors: {
      primary: Color.PRIMARY_LIGHT,
      secondary: Color.PRIMARY_LIGHT,
      outline: Color.LIGHT_GRAY,
      onSurface: Color.BLACK, //underline, textColor
      surfaceVariant: 'transparent', //underlineBackground
      background: isFocused == true ? '#F7FDFF' : Color.WHITE,
    },
    fonts: {
      fontFamily: 'Pretendard Regular',
    },
  };
  return (
    <>
      <StyledTextInput
        theme={theme}
        onChange={onChangeInputCount}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
        {...props}></StyledTextInput>
      {props.maxLength != undefined && (
        <XSmallText
          style={{
            position: 'absolute',
            right: 20,
            bottom: 20,
            color: Color.DARK_GRAY,
          }}>
          <XSmallText
            style={{
              color: Color.PRIMARY_LIGHT,
            }}>
            {inputCount}
          </XSmallText>
          /500
        </XSmallText>
      )}
    </>
  );
}

export default Input;
