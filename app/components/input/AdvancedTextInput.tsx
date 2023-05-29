import TextInput from '../styled/components/TextInput';
import React from 'react';
import {
  ColorValue,
  ReturnKeyTypeOptions,
  StyleProp,
  StyleSheet,
  TextStyle,
} from 'react-native';
import styles from './styles';

type Props = {
  label?: string;
  disabled?: boolean;
  customStyle?: StyleProp<TextStyle>;
  text: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  autoFocus?: boolean;
  activeUnderlineColor?: string;
  underlineColor?: ColorValue;
  paperInputMode?: 'flat' | 'outlined' | undefined;
  multiline?: boolean;
  scrollEnabled?: boolean;
  returnKeyType?: ReturnKeyTypeOptions;
};

export const AdvancedTextInput = ({
  label,
  disabled,
  customStyle,
  text,
  placeholder,
  onChangeText,
  autoFocus = false,
  activeUnderlineColor,
  underlineColor,
  paperInputMode,
  multiline = false,
  scrollEnabled = true,
  returnKeyType,
}: Props): JSX.Element => {
  return (
    <TextInput
      style={customStyle}
      mode={paperInputMode}
      label={label}
      disabled={disabled}
      value={text}
      placeholder={placeholder}
      onChangeText={onChangeText}
      autoFocus={autoFocus}
      activeUnderlineColor={activeUnderlineColor}
      underlineColor={underlineColor?.toString()}
      selectionColor={'white'}
      multiline={multiline}
      scrollEnabled={scrollEnabled}
      returnKeyType={returnKeyType}
    />
  );
};
