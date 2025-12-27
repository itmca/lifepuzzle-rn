import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  TextInput,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
  LayoutChangeEvent,
  findNodeHandle,
} from 'react-native';
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
  scrollViewRef?: React.RefObject<any>;
};

type TextValidation = {
  condition: (text: string) => boolean;
  errorText: string | ((text: string) => string);
};

export type TextAreaInputRef = {
  focus: () => void;
  blur: () => void;
};

const TextAreaInput = forwardRef<TextAreaInputRef, Props>(
  (
    {
      label,
      text,
      onChangeText,
      placeholder,
      validations = [],
      onIsErrorChanged,
      scrollViewRef,
    },
    ref,
  ): React.ReactElement => {
    const inputRef = useRef<TextInput>(null);
    const inputLayoutY = useRef<number>(0);
    const [focused, setFocused] = useState(false);
    const [changed, setChanged] = useState<boolean>(false);
    const [localText, setLocalText] = useState(text);

    // Expose focus/blur methods to parent
    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
    }));

    // Sync external text changes to local state only when not focused
    // This prevents interruption of composition during Korean/Japanese input
    useEffect(() => {
      if (!focused) {
        setLocalText(text);
      }
    }, [text, focused]);

    const violated = validations.find(v => !v.condition(localText));
    const isError = changed && !!violated;

    useEffect(() => {
      if (onIsErrorChanged && changed) {
        onIsErrorChanged(isError);
      }
    }, [isError, onIsErrorChanged, changed]);

    const handleChangeText = (nextText: string) => {
      setLocalText(nextText);
      onChangeText(nextText);
      setChanged(true);
    };

    const handleBlur = () => {
      setFocused(false);
      // Ensure parent has the latest value on blur
      onChangeText(localText);
    };

    const handleContentSizeChange = (
      event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
    ) => {
      if (!scrollViewRef?.current || !focused) {
        return;
      }

      // TextInput 높이가 변경될 때 (줄바꿈 등) 약간의 딜레이 후 스크롤
      // 키보드 애니메이션과 겹치지 않도록 딜레이 추가
      const newHeight = event.nativeEvent.contentSize.height;
      setTimeout(() => {
        if (scrollViewRef?.current) {
          // TextInput의 Y 좌표 + 새로운 높이를 기준으로 스크롤
          // ScrollView 컨텐츠 내에서의 절대 위치 사용
          scrollViewRef.current.scrollTo({
            y: inputLayoutY.current + newHeight,
            animated: true,
          });
        }
      }, 100);
    };

    return (
      <ContentContainer
        gap={6}
        backgroundColor={Color.TRANSPARENT}
        onLayout={(event: LayoutChangeEvent) => {
          inputLayoutY.current = event.nativeEvent.layout.y;
        }}
      >
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
            ref={inputRef}
            value={localText}
            onChangeText={handleChangeText}
            multiline
            onBlur={handleBlur}
            onFocus={() => setFocused(true)}
            onContentSizeChange={handleContentSizeChange}
            placeholder={focused ? '' : placeholder}
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
  },
);

TextAreaInput.displayName = 'TextAreaInput';

export { TextAreaInput };
