import React, {useEffect, useState} from 'react';
import {HelperText} from 'react-native-paper';
import TextInput from '../styled/components/TextInput';
import {styles} from '../../pages/Register/styles';
import {View} from 'react-native';

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
  const [changed, setChanged] = useState<boolean>(false);

  const violated = validations.find(v => !v.condition(value));
  const isErrorInternal = changed && !!violated;

  useEffect(() => {
    if (onIsErrorChanged && changed) {
      onIsErrorChanged(isErrorInternal);
    }
  }, [isErrorInternal]);

  return (
    <>
      <TextInput
        style={styles.formInput}
        mode="outlined"
        label={label}
        value={value}
        onChangeText={(text: string) => {
          onChangeText(text);
          setChanged(true);
        }}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
      />
      <View
        style={{
          justifyContent: 'flex-start',
          width: '100%',
          alignContent: 'flex-start',
        }}>
        {isErrorInternal ? (
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
