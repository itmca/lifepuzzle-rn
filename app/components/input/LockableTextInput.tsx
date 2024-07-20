import {TextInput} from 'react-native-paper';
import React, {useState} from 'react';
import {StyleProp, StyleSheet, TextStyle} from 'react-native';
import {ContentContainer} from '../styled/container/ContentContainer';
import {ImageButton} from '../styled/components/Button';
import {MediumImage} from '../styled/components/Image';
import {Color} from '../../constants/color.constant';

type Props = {
  label?: string;
  disabled?: boolean;
  customStyle?: StyleProp<TextStyle>;
  text: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  autoFocus?: boolean;
  multiline?: boolean;
  mode?: 'flat' | 'outlined' | undefined;
  underlineColor?: string | 'transparent';
  activeUnderlineColor?: string | 'transparent';
  borderColor?: string;
  backgroundColor?: string;
  clearButton?: boolean;
};

export const LockableTextInput = ({
  customStyle,
  text,
  placeholder,
  onChangeText,
  autoFocus = false,
  multiline = false,
  mode = 'flat',
}: Props): JSX.Element => {
  const [editable, setEditable] = useState(false);
  const theme = {
    colors: {
      primary: editable ? Color.WHITE : 'transparent' /*active 밑줄*/,
      secondary: Color.WHITE,
      outline: '',
      onSurface: Color.WHITE /*글자색*/,
      surfaceVariant: editable ? '#00000011' : 'transparent' /*배경색*/,
      onSurfaceDisabled: Color.BLACK,
      onSurfaceVariant: Color.FONT_DARK /*placeholder 색상*/,
    },
  };
  return (
    <ContentContainer useHorizontalLayout withNoBackground width={'auto'}>
      <ContentContainer width={'auto'} withNoBackground>
        <TextInput
          mode={mode}
          theme={theme}
          style={StyleSheet.compose<TextStyle>(customStyle)}
          editable={editable}
          value={text}
          placeholder={placeholder}
          onChangeText={onChangeText}
          autoFocus={autoFocus}
          multiline={multiline}
          onBlur={() => setEditable(false)}
          onFocus={() => setEditable(true)}
        />
      </ContentContainer>
      <ContentContainer width={'auto'} withNoBackground>
        <ImageButton
          onPress={() => {
            setEditable(editable => !editable);
          }}
          backgroundColor={'transparent'}
          marginBottom={'0px'}>
          <MediumImage
            width={25}
            height={25}
            resizeMode={'contain'}
            source={require('../../assets/images/color-pencil.png')}
          />
        </ImageButton>
      </ContentContainer>
    </ContentContainer>
  );
};
