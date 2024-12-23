import {CustomTextInput} from '../styled/components/CustomTextInput.tsx';
import React, {useState} from 'react';
import {StyleProp, TextStyle} from 'react-native';
import {TextInput as ReactInput} from 'react-native-paper';
import {Color} from '../../constants/color.constant';

type Props = {
  disabled?: boolean;
  customStyle?: StyleProp<TextStyle>;
  password: string;
  placeholder?: string;
  onChangePassword?: (text: string) => void;
  secureTextEntry?: boolean;
  autoFocus?: boolean;
};

export const PasswordInput = ({
  customStyle,
  password,
  placeholder,
  onChangePassword,
  autoFocus = false,
}: Props): JSX.Element => {
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);

  return (
    <CustomTextInput
      customStyle={customStyle}
      mode="outlined"
      value={password}
      placeholder={placeholder}
      onChangeText={onChangePassword}
      secureTextEntry={isPasswordSecure}
      autoFocus={autoFocus}
      right={
        <ReactInput.Icon
          icon={isPasswordSecure ? 'eye' : 'eye-off'}
          color={Color.DARK_GRAY}
          onPress={() => {
            isPasswordSecure
              ? setIsPasswordSecure(false)
              : setIsPasswordSecure(true);
          }}
        />
      }
    />
  );
};
