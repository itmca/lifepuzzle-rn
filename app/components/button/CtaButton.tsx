import React from 'react';
import {Color} from '../../constants/color.constant';
import {MediumButton} from '../styled/components/Button';
import MediumText from '../styled/components/Text';

type Props = {
  onPress: () => void;
  text: string;
  active?: boolean;
  filled?: boolean;
  outlined?: boolean;
  disabled?: boolean;

  marginTop?: string;
};
function theme(mode: string) {
  switch (mode) {
    case 'lightblue':
      return {
        backgroundColor: Color.SECONDARY_LIGHT,
        color: Color.PRIMARY_LIGHT,
        borderRadius: '16px',
      };
    case 'black':
      return {
        backgroundColor: Color.LIGHT_BLACK,
        color: Color.WHITE,
        borderRadius: '6px',
      };
    case 'white':
      return {
        backgroundColor: Color.WHITE,
        color: Color.MEDIUM_GRAY,
        borderRadius: '6px',
        borderColor: Color.MEDIUM_GRAY,
        borderWidth: 0.5,
      };
    default:
      return {
        backgroundColor: Color.SECONDARY_LIGHT,
        color: Color.PRIMARY_LIGHT,
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
  disabled = false,
}: Props): JSX.Element => {
  const mode = active
    ? 'lightblue'
    : filled
    ? 'black'
    : outlined
    ? 'white'
    : '';
  const {backgroundColor, color, borderRadius, borderColor, borderWidth} =
    theme(mode);
  return (
    <MediumButton
      marginTop={marginTop}
      disabled={disabled}
      onPress={onPress}
      backgroundColor={backgroundColor}
      borderRadius={borderRadius}
      borderColor={borderColor}
      borderWidth={borderWidth}>
      <MediumText fontWeight={600} color={disabled ? Color.FONT_DARK : color}>
        {text}
      </MediumText>
    </MediumButton>
  );
};

export default CtaButton;
