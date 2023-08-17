import styled from 'styled-components/native';
import {TextInput} from 'react-native-paper';
import React, {useState} from 'react';
import {XSmallText} from './Text';
import {NativeSyntheticEvent, TextInputChangeEventData} from 'react-native';
import {Color} from '../../../constants/color.constant';
import {NoOutLineFullScreenContainer} from '../container/ScreenContainer';

type Props = {
  width?: number;
  fontSize?: number;
  fontWeight?: number | 'normal';
};

const StyledTextInput = styled(TextInput).attrs(props => ({
  outlineStyle: props.outlineStyle ?? {borderWidth: 1},
  right: props.right,
}))<Props>`
  width: ${props => (props.width ? `${props.width}%` : '100%')};
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
    roundness: 4,
    colors: {
      primary: Color.PRIMARY_LIGHT,
      secondary: Color.PRIMARY_LIGHT,
      outline: 'transparent',
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
      {props.maxLength == undefined ? (
        <StyledTextInput
          theme={theme}
          onChange={onChangeInputCount}
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
          {...props}></StyledTextInput>
      ) : (
        <NoOutLineFullScreenContainer
          style={
            isFocused
              ? {
                  backgroundColor: '#F7FDFF',
                  borderWidth: 1,
                  borderColor: Color.PRIMARY_LIGHT,
                  borderRadius: 4,
                }
              : {}
          }>
          <StyledTextInput
            outlineStyle={{borderWidth: 0}}
            theme={{
              colors: {
                primary: Color.PRIMARY_LIGHT,
                background: 'transparent',
              },
            }}
            onChange={onChangeInputCount}
            onBlur={() => setIsFocused(false)}
            onFocus={() => setIsFocused(true)}
            {...props}></StyledTextInput>
          <XSmallText
            style={{
              color: Color.DARK_GRAY,
              alignSelf: 'flex-end',
              marginRight: 20,
              marginBottom: 15,
            }}>
            <XSmallText
              style={{
                color: Color.PRIMARY_LIGHT,
              }}>
              {inputCount}
            </XSmallText>{' '}
            / 500
          </XSmallText>
        </NoOutLineFullScreenContainer>
      )}
    </>
  );
}

export default Input;
