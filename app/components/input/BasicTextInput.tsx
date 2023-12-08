import TextInput from '../styled/components/TextInput';
import {TextInput as ReactInput} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import {StyleProp, StyleSheet, TextStyle} from 'react-native';
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
  borderColor,
  backgroundColor,
  clearButton = false,
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
      borderColor={borderColor}
      backgroundColor={backgroundColor}
      right={
        clearButton && onChangeText && text != '' ? (
          <ReactInput.Icon
            icon={'close'}
            iconColor={Color.DARK_GRAY}
            onPress={() => {
              onChangeText('');
            }}
          />
        ) : (
          <></>
        )
      }
    />
  );
};
