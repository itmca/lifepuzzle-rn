import {CustomTextInput} from '../styled/components/CustomTextInput.tsx';
import {TextInput as ReactInput} from 'react-native-paper';
import React from 'react';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {Color} from '../../constants/color.constant';

type Props = {
  label?: string;
  disabled?: boolean;
  customStyle?: StyleProp<TextStyle>;
  outlineStyle?: StyleProp<ViewStyle>;
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
  focusedBackgroundColor?: string;
  clearButton?: boolean;
  noPadding?: boolean;
  useFocusedStyle?: boolean;
};

export const BasicTextInput = ({
  label,
  disabled,
  customStyle,
  outlineStyle,
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
  focusedBackgroundColor,
  clearButton = false,
  noPadding = false,
  useFocusedStyle = true,
}: Props): JSX.Element => {
  return (
    <CustomTextInput
      customStyle={customStyle}
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
      focusedBackgroundColor={focusedBackgroundColor}
      outlineStyle={outlineStyle}
      right={
        clearButton && onChangeText && text !== '' ? (
          <ReactInput.Icon
            icon={'close'}
            color={Color.DARK_GRAY}
            onPress={() => {
              onChangeText('');
            }}
          />
        ) : null
      }
      noPadding={noPadding}
      useFocusedStyle={useFocusedStyle}
    />
  );
};
