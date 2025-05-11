import React, {useEffect, useState} from 'react';
import {TextInput} from 'react-native';
import {Color} from '../../constants/color.constant';
import {ContentContainer} from '../styled/container/ContentContainer';
import {BodyTextM, Caption} from '../styled/components/Text.tsx';
import {SvgIcon} from '../styled/components/SvgIcon.tsx';

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

const BasicTextInput = ({
  label,
  text,
  onChangeText,
  placeholder,
  secureTextEntry,
  validations = [],
  onIsErrorChanged,
}: Props): JSX.Element => {
  const [focused, setFocused] = useState(false);
  const [changed, setChanged] = useState<boolean>(false);

  const violated = validations.find(v => !v.condition(text));
  const isError = changed && !!violated;
  const isSuccess = text && !isError;

  const [visible, setVisible] = useState(secureTextEntry);

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
        borderRadius={6}>
        <TextInput
          value={text}
          onChangeText={(text: string) => {
            onChangeText(text);
            setChanged(true);
          }}
          onBlur={() => setFocused(false)}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          secureTextEntry={visible}
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
          gap={8}>
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
          gap={2}>
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

//테두리 없는 TextInput
export const PlainTextInput = ({
  label,
  text,
  onChangeText,
  placeholder,
  validations = [],
  onIsErrorChanged,
}: Props): JSX.Element => {
  const [focused, setFocused] = useState(false);
  const [changed, setChanged] = useState<boolean>(false);

  const violated = validations.find(v => !v.condition(text));
  const isError = changed && !!violated;
  const isSuccess = text && !isError;

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
        borderRadius={6}>
        <TextInput
          value={text}
          onChangeText={(text: string) => {
            onChangeText(text);
            setChanged(true);
          }}
          onBlur={() => setFocused(false)}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          style={{
            fontSize: 16,
            fontFamily: 'SUIT-SemiBold',
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
          gap={8}>
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
          gap={2}>
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
