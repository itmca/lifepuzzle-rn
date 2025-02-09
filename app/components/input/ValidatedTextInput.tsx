import React, {useEffect, useState} from 'react';
import {HelperText} from 'react-native-paper';
import {CustomTextInput} from '../styled/components/CustomTextInput.tsx';
import {LegacyColor} from '../../constants/color.constant';
import Icon from '../styled/components/Icon';
import {ContentContainer} from '../styled/container/ContentContainer';

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
  const borderColor = isError
    ? LegacyColor.ALERT_DARK
    : LegacyColor.PRIMARY_LIGHT;
  const [visible, setVisible] = useState(secureTextEntry);

  const theme = {
    roundness: 6,
    colors: {
      primary: borderColor,
      secondary: LegacyColor.PRIMARY_LIGHT,
      outline: isError || value ? borderColor : LegacyColor.LIGHT_GRAY,
      onSurface: LegacyColor.FONT_DARK, //underline, textColor
      surfaceVariant: 'transparent', //underlineBackground
      background: focused || isSuccess ? LegacyColor.WHITE : '#FDFDFD',
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
    <ContentContainer gap={0}>
      <ContentContainer useHorizontalLayout>
        <CustomTextInput
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
          secureTextEntry={visible}
          theme={theme}
        />
        <ContentContainer
          useHorizontalLayout
          absoluteRightPosition
          withNoBackground
          width={'auto'}
          paddingHorizontal={8}
          gap={4}>
          {secureTextEntry && (
            <Icon
              name={visible ? 'visibility' : 'visibility-off'}
              size={24}
              color={LegacyColor.DARK_GRAY}
              onPress={() => {
                visible ? setVisible(false) : setVisible(true);
              }}
            />
          )}
          {value && (
            <Icon
              name={'close'}
              size={24}
              color={LegacyColor.DARK_GRAY}
              onPress={() => {
                onChangeText('');
              }}
            />
          )}
        </ContentContainer>
      </ContentContainer>
      <ContentContainer>
        {isError ? (
          <HelperText type="error">
            {typeof violated?.errorText === 'function'
              ? violated?.errorText(value)
              : violated?.errorText}
          </HelperText>
        ) : null}
      </ContentContainer>
    </ContentContainer>
  );
};

export default ValidatedTextInput;
