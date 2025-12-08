import React, { useEffect, useRef, useState } from 'react';
import { TextInput } from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Color } from '../../../constants/color.constant';
import { ContentContainer } from '../layout/ContentContainer';
import { BodyTextM, Caption } from '../base/TextBase';
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
  const [localValue, setLocalValue] = useState(text);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const violated = validations.find(v => !v.condition(localValue));
  const isError = changed && !!violated;

  const [visible, setVisible] = useState(!secureTextEntry);

  // Choose the appropriate TextInput component
  const InputComponent = useInBottomSheet ? BottomSheetTextInput : TextInput;

  // Sync local value with external text prop when it changes externally
  useEffect(() => {
    setLocalValue(text);
  }, [text]);

  useEffect(() => {
    if (onIsErrorChanged && changed) {
      onIsErrorChanged(isError);
    }
  }, [isError]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Flush pending update immediately
  const flushUpdate = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onChangeText(localValue);
  };

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
          value={localValue}
          onChangeText={(newText: string) => {
            setLocalValue(newText);
            setChanged(true);

            // Clear existing timeout
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }

            // Set new timeout to update parent after 300ms (debounced)
            timeoutRef.current = setTimeout(() => {
              onChangeText(newText);
            }, 300);
          }}
          onEndEditing={() => {
            flushUpdate();
          }}
          onBlur={() => {
            setFocused(false);
            flushUpdate();
          }}
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
          {localValue && (
            <SvgIcon
              name={'closeFilled'}
              size={24}
              color={Color.GREY_600}
              onPress={() => {
                setLocalValue('');
                onChangeText('');
              }}
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
          <Caption color={Color.ERROR_300}>
            {typeof violated?.errorText === 'function'
              ? violated?.errorText(localValue)
              : violated?.errorText}
          </Caption>
        </ContentContainer>
      ) : null}
    </ContentContainer>
  );
};

//테두리 없는 TextInput
export const PlainTextInput = ({
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
    <ContentContainer gap={6}>
      {label && (
        <ContentContainer>
          <BodyTextM>{label}</BodyTextM>
        </ContentContainer>
      )}
      <ContentContainer
        useHorizontalLayout
        paddingHorizontal={0}
        paddingVertical={0}
        borderColor={
          isError ? Color.ERROR_300 : focused ? Color.GREY_600 : Color.GREY_200
        }
        borderRadius={6}
      >
        <TextInput
          value={text}
          onChangeText={(text: string) => {
            onChangeText(text);
            setChanged(true);
          }}
          onBlur={() => setFocused(false)}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          placeholderTextColor={Color.GREY_400}
          style={{
            fontSize: 16,
            fontFamily: 'SUIT-SemiBold',
            letterSpacing: -0.25,
            width: '100%',
            paddingVertical: 0,
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
              onPress={() => {
                onChangeText('');
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
          <Caption color={Color.ERROR_300}>
            {typeof violated?.errorText === 'function'
              ? violated?.errorText(text)
              : violated?.errorText}
          </Caption>
        </ContentContainer>
      ) : null}
    </ContentContainer>
  );
};
export default BasicTextInput;
