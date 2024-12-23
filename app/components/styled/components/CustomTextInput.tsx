import styled from 'styled-components/native';
import {TextInput} from 'react-native-paper';
import React, {useState} from 'react';
import {Color} from '../../../constants/color.constant';
import {StyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import {TextStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import {StyleSheet, ViewStyle} from 'react-native';

type StyledTextInputProps = {
  width?: number;
  fontSize?: number;
  fontWeight?: number | 'normal';
  borderWidth?: number;
  right?: React.ReactNode;
};

const StyledTextInput = styled(TextInput).attrs(props => ({
  outlineStyle: props.outlineStyle ?? {borderWidth: 1},
  right: props.right,
}))<StyledTextInputProps>`
  width: ${props => (props.width ? `${props.width}%` : '100%')};
  font-size: ${props => (props.fontSize ? `${props.fontSize}px` : '16px')};
  font-weight: ${props =>
    props.fontWeight ? `${props.fontWeight}px` : 'normal'};
`;

type CustomTextInputProps = {
  mode: 'flat' | 'outlined';
  width?: number;
  fontSize?: number;
  fontWeight?: number | 'normal';
  theme?: any;
  borderColor?: string;
  backgroundColor?: string;
  focusedBackgroundColor?: string;
  underlineColor?: string;
  activeUnderlineColor?: string;
  customStyle?: StyleProp<TextStyle>;
  outlineStyle?: StyleProp<ViewStyle>;
  label?: string;
  placeholder?: string;
  right?: React.ReactNode;
  disabled?: boolean;
  secureTextEntry?: boolean;
  multiline?: boolean;
  autoFocus?: boolean;
  noPadding?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
};

export const CustomTextInput = ({
  mode,
  borderColor,
  backgroundColor,
  focusedBackgroundColor = '#F7FDFF',
  underlineColor,
  activeUnderlineColor,
  customStyle,
  outlineStyle,
  label,
  placeholder,
  right,
  disabled,
  secureTextEntry,
  multiline,
  autoFocus,
  noPadding = false,
  value,
  onChangeText,
  onPress,
}: CustomTextInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const theme = {
    roundness: 4,
    colors: {
      primary: Color.PRIMARY_LIGHT,
      secondary: Color.PRIMARY_LIGHT,
      outline: isFocused ? 'transparent' : borderColor ?? Color.LIGHT_GRAY,
      onSurface: Color.BLACK, //underline, textColor
      surfaceVariant: 'transparent', //underlineBackground
      background: isFocused
        ? focusedBackgroundColor
        : backgroundColor ?? '#FDFDFD',
    },
    fonts: {
      fontFamily: 'Pretendard Regular',
    },
  };

  return (
    <StyledTextInput
      theme={theme}
      mode={mode}
      underlineColor={underlineColor}
      activeUnderlineColor={activeUnderlineColor}
      style={StyleSheet.compose(
        customStyle,
        noPadding ? {paddingHorizontal: 0, paddingVertical: 0} : {},
      )}
      contentStyle={StyleSheet.compose(
        customStyle,
        noPadding ? {paddingHorizontal: 0, paddingVertical: 0} : {},
      )}
      outlineStyle={outlineStyle}
      label={label}
      placeholder={placeholder}
      right={right}
      disabled={disabled}
      secureTextEntry={secureTextEntry}
      multiline={multiline}
      autoFocus={autoFocus}
      dense={true}
      value={value}
      onPressIn={onPress}
      onChangeText={onChangeText}
      onBlur={() => setIsFocused(false)}
      onFocus={() => setIsFocused(true)}
    />
  );
};
