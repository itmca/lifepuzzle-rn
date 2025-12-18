import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native';
import { Color } from '../../../constants/color.constant.ts';
import { ContentContainer } from '../layout/ContentContainer';
import { BodyTextM } from '../base/TextBase';

type Props = {
  label?: string;
  text: string;
  onChangeText: (text: string) => void;
  validations?: TextValidation[];
  placeholder?: string;
  secureTextEntry?: boolean;
  onIsErrorChanged?: (isError: boolean) => void;
};

type TextValidation = {
  condition: (text: string) => boolean;
  errorText: string | ((text: string) => string);
};

const TextAreaInput = ({
  label,
  text,
  onChangeText,
  placeholder,
  validations = [],
  onIsErrorChanged,
}: Props): React.ReactElement => {
  const [focused, setFocused] = useState(false);
  const [changed, setChanged] = useState<boolean>(false);

  const violated = validations.find(v => !v.condition(text));
  const isError = changed && !!violated;

  useEffect(() => {
    if (onIsErrorChanged && changed) {
      onIsErrorChanged(isError);
    }
  }, [isError]);
  return (
    <ContentContainer gap={6} backgroundColor={Color.TRANSPARENT}>
      {label && (
        <ContentContainer>
          <BodyTextM>{label}</BodyTextM>
        </ContentContainer>
      )}
      <ContentContainer
        backgroundColor={Color.TRANSPARENT}
        borderColor={
          isError
            ? Color.ERROR_300
            : focused
              ? Color.GREY_400
              : Color.TRANSPARENT
        }
        borderRadius={6}
      >
        <TextInput
          value={text}
          onChangeText={(text: string) => {
            onChangeText(text);
            setChanged(true);
          }}
          multiline
          onBlur={() => setFocused(false)}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          // BodyTextM Style
          style={{
            fontSize: 14,
            fontFamily: 'SUIT-Medium',
            lineHeight: 14 * 1.4,
            letterSpacing: -0.25,
            width: '100%',
          }}
        />
      </ContentContainer>
    </ContentContainer>
  );
};

export default TextAreaInput;
