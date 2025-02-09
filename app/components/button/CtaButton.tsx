import React from 'react';
import {LegacyColor} from '../../constants/color.constant';
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
        backgroundColor: LegacyColor.PRIMARY_LIGHT,
        color: LegacyColor.WHITE,
        borderRadius: 16,
      };
    case 'black':
      return {
        backgroundColor: LegacyColor.LIGHT_BLACK,
        color: LegacyColor.WHITE,
        borderRadius: 16,
      };
    case 'white':
      return {
        backgroundColor: LegacyColor.WHITE,
        color: LegacyColor.BLACK,
        borderRadius: 16,
        borderColor: LegacyColor.MEDIUM_GRAY,
        borderWidth: 1,
      };
    case 'gray':
      return {
        backgroundColor: LegacyColor.LIGHT_GRAY,
        color: LegacyColor.FONT_DARK,
        borderRadius: 16,
        borderColor: LegacyColor.LIGHT_GRAY,
        borderWidth: 1,
      };
    default:
      return {
        backgroundColor: LegacyColor.SECONDARY_LIGHT,
        color: LegacyColor.PRIMARY_LIGHT,
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
      <MediumText
        fontWeight={600}
        color={disabled ? LegacyColor.FONT_DARK : color}>
        {text}
      </MediumText>
    </MediumButton>
  );
};

export default CtaButton;
