import TextInput from '../styled/components/TextInput';
import React from 'react';
import {StyleProp, StyleSheet, TextStyle} from 'react-native';
import styles from './styles';

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
};

export const BasicTextInput = ({
  label,
  disabled,
  customStyle,
  text,
  placeholder,
  onChangeText,
  autoFocus = false,
  multiline = false,
  mode = 'outlined',
  underlineColor,
  activeUnderlineColor,
}: Props): JSX.Element => {
  return (
    <TextInput
      style={StyleSheet.compose<TextStyle>(customStyle)}
      mode={mode}
      label={label}
      disabled={disabled}
      value={text}
      placeholder={placeholder}
      onChangeText={onChangeText}
      autoFocus={autoFocus}
      multiline={multiline}
      underlineColor={underlineColor}
      activeUnderlineColor={activeUnderlineColor}
    />
  );
};
