import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native';
import { Color } from '../../../../constants/color.constant.ts';
import { ContentContainer } from '../../../../components/ui/layout/ContentContainer';
import { BodyTextM } from '../../../../components/ui/base/TextBase';

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
  }, [isError, onIsErrorChanged, changed]);
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
          onChangeText={(nextText: string) => {
            onChangeText(nextText);
            setChanged(true);
          }}
          multiline
          onBlur={() => setFocused(false)}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          placeholderTextColor={Color.GREY_500}
          // BodyTextM Style
          style={{
            fontSize: 16,
            fontFamily: 'SUIT-Medium',
            lineHeight: 16 * 1.6,
            letterSpacing: -0.25,
            width: '100%',
          }}
        />
      </ContentContainer>
    </ContentContainer>
  );
};

export default TextAreaInput;
