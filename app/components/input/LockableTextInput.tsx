import {TextInput} from 'react-native-paper';
import React from 'react';
import {StyleProp, StyleSheet, TextStyle} from 'react-native';
import {ContentContainer} from '../styled/container/ContentContainer';
import {Color} from '../../constants/color.constant';

type Props = {
  label?: string;
  disabled?: boolean;
  customStyle?: StyleProp<TextStyle>;
  text: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  autoFocus?: boolean;
  multiline?: boolean;
  mode?: 'flat' | 'outlined' | undefined;
  underlineColor?: string | 'transparent';
  activeUnderlineColor?: string | 'transparent';
  borderColor?: string;
  backgroundColor?: string;
  clearButton?: boolean;
};

export const LockableTextInput = ({
  customStyle,
  text,
  placeholder,
  onChangeText,
  autoFocus = false,
  multiline = false,
  mode = 'flat',
}: Props): JSX.Element => {
  const theme = {
    colors: {
      primary: Color.WHITE /*active 밑줄*/,
      secondary: Color.WHITE,
      outline: '',
      onSurface: Color.WHITE /*글자색*/,
      surfaceVariant: '#00000011' /*배경색*/,
      onSurfaceDisabled: Color.BLACK,
      onSurfaceVariant: Color.FONT_DARK /*placeholder 색상*/,
    },
  };
  return (
    <ContentContainer
      useHorizontalLayout
      withNoBackground
      width={'auto'}
      gap={0}>
      <ContentContainer width={'auto'} withNoBackground>
        <TextInput
          mode={mode}
          theme={theme}
          style={StyleSheet.compose<TextStyle>(customStyle)}
          value={text}
          placeholder={placeholder}
          onChangeText={onChangeText}
          autoFocus={autoFocus}
          multiline={multiline}
          underlineColor={Color.WHITE}
        />
      </ContentContainer>
    </ContentContainer>
  );
};
