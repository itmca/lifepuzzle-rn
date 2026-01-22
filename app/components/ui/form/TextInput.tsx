import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Color } from '../../../constants/color.constant';
import { ContentContainer } from '../layout/ContentContainer';
import { BodyTextM, CaptionB } from '../base/TextBase';
import { SvgIcon } from '../display/SvgIcon';

type Props = {
  label?: string;
  text: string;
  onChangeText: (text: string) => void;
  validations?: TextValidation[];
  placeholder?: string;
  secureTextEntry?: boolean;
  onIsErrorChanged?: (isError: boolean) => void;
  useInBottomSheet?: boolean;
};

type TextValidation = {
  condition: (text: string) => boolean;
  errorText: string | ((text: string) => string);
};

const BasicTextInput = ({
  label,
  text,
  onChangeText,
  placeholder,
  secureTextEntry,
  validations = [],
  onIsErrorChanged,
  useInBottomSheet = false,
}: Props): React.ReactElement => {
  const [focused, setFocused] = useState(false);
  const [changed, setChanged] = useState<boolean>(false);

  const violated = validations.find(v => !v.condition(text));
  const isError = changed && !!violated;

  const [visible, setVisible] = useState(!secureTextEntry);

  // Choose the appropriate TextInput component
  const InputComponent = useInBottomSheet ? BottomSheetTextInput : TextInput;

  useEffect(() => {
    if (onIsErrorChanged && changed) {
      onIsErrorChanged(isError);
    }
  }, [isError]);

  return (
    <ContentContainer gap={6}>
      {label && (
        <ContentContainer>
          <BodyTextM>{label}</BodyTextM>
        </ContentContainer>
      )}
      <ContentContainer
        useHorizontalLayout
        paddingHorizontal={16}
        height={48}
        withBorder
        borderColor={
          isError ? Color.ERROR_300 : focused ? Color.GREY_600 : Color.GREY_200
        }
        borderRadius={6}
      >
        <InputComponent
          value={text}
          onChangeText={(newText: string) => {
            setChanged(true);
            onChangeText(newText);
          }}
          onBlur={() => setFocused(false)}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          placeholderTextColor={Color.GREY_400}
          secureTextEntry={!visible}
          // BodyTextM Style
          style={{
            fontSize: 14,
            fontFamily: 'SUIT-Medium',
            letterSpacing: -0.25,
            width: '100%',
          }}
        />
        <ContentContainer
          useHorizontalLayout
          absoluteRightPosition
          withNoBackground
          width={'auto'}
          paddingHorizontal={8}
          gap={8}
        >
          {text && (
            <SvgIcon
              name={'closeFilled'}
              size={24}
              color={Color.GREY_600}
              onPress={() => onChangeText('')}
            />
          )}
          {secureTextEntry && (
            <SvgIcon
              name={visible ? 'eyeOn' : 'eyeOff'}
              size={24}
              color={Color.GREY_600}
              onPress={() => {
                visible ? setVisible(false) : setVisible(true);
              }}
            />
          )}
        </ContentContainer>
      </ContentContainer>
      {isError ? (
        <ContentContainer
          useHorizontalLayout
          justifyContent={'flex-start'}
          gap={2}
        >
          <SvgIcon name={'error'} size={16} />
          <CaptionB color={Color.ERROR_300}>
            {typeof violated?.errorText === 'function'
              ? violated?.errorText(text)
              : violated?.errorText}
          </CaptionB>
        </ContentContainer>
      ) : null}
    </ContentContainer>
  );
};

export { BasicTextInput };
