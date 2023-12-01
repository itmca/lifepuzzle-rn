import React, { useEffect, useState } from 'react';
import { HelperText } from 'react-native-paper';
import TextInput from '../styled/components/TextInput';
import { styles } from '../../pages/Register/styles';
import { View } from 'react-native';
import { Color } from '../../constants/color.constant';
import Icon from '../styled/components/Icon';
import { HorizontalContentContainer } from '../styled/container/ContentContainer';
type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  validations?: TextValidation[];
  placeholder: string;
  secureTextEntry?: boolean;
  onIsErrorChanged?: (isError: boolean) => void;
};

type TextValidation = {
  condition: (text: string) => boolean;
  errorText: string | ((text: string) => string);
};

const ValidatedTextInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  validations = [],
  onIsErrorChanged,
}: Props): JSX.Element => {
  const [focused, setFocused] = useState(false);
  const [changed, setChanged] = useState<boolean>(false);

  const violated = validations.find(v => !v.condition(value));
  const isError = changed && !!violated;
  const isSuccess = value && !isError;
  const borderColor = isError ? Color.ALERT_DARK : Color.PRIMARY_LIGHT;
  const [isPasswordSecure, setIsPasswordSecure] = useState(secureTextEntry);

  const theme = {
    roundness: 6,
    colors: {
      primary: borderColor,
      secondary: Color.PRIMARY_LIGHT,
      outline: isError || value ? borderColor : Color.LIGHT_GRAY,
      onSurface: Color.FONT_DARK, //underline, textColor
      surfaceVariant: 'transparent', //underlineBackground
      background: focused || isSuccess ? Color.WHITE : '#FDFDFD'
    },
    fonts: {
      fontFamily: 'Pretendard Regular',
    },
  };
  useEffect(() => {
    if (onIsErrorChanged && changed) {
      onIsErrorChanged(isError);
    }
  }, [isError]);

  return (
    <>
      <HorizontalContentContainer>
        <TextInput
          style={styles.input}
          mode="outlined"
          label={label}
          value={value}
          height={44}
          onChangeText={(text: string) => {
            onChangeText(text);
            setChanged(true);
          }}
          onBlur={() => setFocused(false)}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          secureTextEntry={isPasswordSecure}
          theme={theme}
        />
        <HorizontalContentContainer style={styles.iconView}>
          {secureTextEntry && (
            <Icon
              name={isPasswordSecure ? 'visibility' : 'visibility-off'}
              size={24}
              color={Color.DARK_GRAY}
              style={styles.icon}
              onPress={() => {
                isPasswordSecure
                  ? setIsPasswordSecure(false)
                  : setIsPasswordSecure(true);
              }}
            />
          )}
          {isSuccess && (
            <Icon
              name={'check'}
              size={24}
              color={Color.PRIMARY_LIGHT}
              style={styles.icon}
            />
          )}
        </HorizontalContentContainer>
      </HorizontalContentContainer>
      <View
        style={{
          justifyContent: 'flex-start',
          width: '100%',
          alignContent: 'flex-start',
        }}>
        {isError ? (
          <HelperText type="error">
            {typeof violated?.errorText === 'function'
              ? violated?.errorText(value)
              : violated?.errorText}
          </HelperText>
        ) : null}
      </View>
    </>
  );
};

export default ValidatedTextInput;
