import {TextInput} from 'react-native-paper';
import React from 'react';
import {StyleProp, StyleSheet, TextStyle} from 'react-native';
import styles from './styles';

type Props = {
  label?: string;
  disabled?: boolean;
  customStyle?: StyleProp<TextStyle>;
  password: string;
  placeholder?: string;
  onChangePassword?: (text: string) => void;
  secureTextEntry?: boolean;
  autoFocus?: boolean;
};

export const PasswordInput = ({
  label = '비밀번호',
  customStyle,
  password,
  placeholder,
  onChangePassword,
  autoFocus = false,
}: Props): JSX.Element => {
  return (
    <TextInput
      style={StyleSheet.compose<TextStyle>(
        styles.inputDefaultStyle,
        customStyle,
      )}
      mode="outlined"
      label={label}
      value={password}
      placeholder={placeholder}
      onChangeText={onChangePassword}
      secureTextEntry={true}
      autoFocus={autoFocus}
    />
  );
};
