import React from 'react';
import {Color} from '../../constants/color.constant';
import {MediumButton} from '../styled/components/Button';
import MediumText from '../styled/components/LegacyText.tsx';

type Props = {
  onPress: () => void;
  text: string;
  active?: boolean;
  filled?: boolean;
  outlined?: boolean;
  gray?: boolean;
  disabled?: boolean;
  marginTop?: string;
};
function theme(mode: string) {
  switch (mode) {
    case 'lightblue':
      return {
        backgroundColor: Color.PRIMARY_LIGHT,
        color: Color.WHITE,
        borderRadius: 16,
      };
    case 'black':
      return {
        backgroundColor: Color.LIGHT_BLACK,
        color: Color.WHITE,
        borderRadius: 16,
      };
    case 'white':
      return {
        backgroundColor: Color.WHITE,
        color: Color.BLACK,
        borderRadius: 16,
        borderColor: Color.MEDIUM_GRAY,
        borderWidth: 1,
      };
    case 'gray':
      return {
        backgroundColor: Color.LIGHT_GRAY,
        color: Color.FONT_DARK,
        borderRadius: 16,
        borderColor: Color.LIGHT_GRAY,
        borderWidth: 1,
      };
    default:
      return {
        backgroundColor: Color.SECONDARY_LIGHT,
        color: Color.PRIMARY_LIGHT,
        borderRadius: 16,
      };
  }
}
const CtaButton = ({
  onPress,
  text,
  marginTop,
  active = false,
  filled = false,
  outlined = false,
  gray = false,
  disabled = false,
}: Props): JSX.Element => {
  const mode = active
    ? 'lightblue'
    : filled
    ? 'black'
    : outlined
    ? 'white'
    : gray
    ? 'gray'
    : '';
  const {backgroundColor, color, borderColor, borderWidth, borderRadius} =
    theme(mode);

  return (
    <MediumButton
      marginTop={marginTop}
      disabled={disabled}
      onPress={onPress}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      borderWidth={borderWidth}
      borderRadius={borderRadius}>
      <MediumText fontWeight={600} color={disabled ? Color.FONT_DARK : color}>
        {text}
      </MediumText>
    </MediumButton>
  );
};

export default CtaButton;
