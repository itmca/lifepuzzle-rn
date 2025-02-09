import React from 'react';

import {SmallText} from '../styled/components/LegacyText.tsx';
import {MediumButton} from '../styled/components/Button';

type Props = {
  onPress: () => void;
  width?: string;
  flexBasis?: string;
  backgroundColor: string;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  text: string;
  fontColor: string;
  fontWeight: string;
};

export const ModalButton = ({
  onPress,
  // width,
  flexBasis,
  backgroundColor,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderBottomLeftRadius,
  borderBottomRightRadius,
  text,
  fontColor,
  fontWeight,
}: Props): JSX.Element => {
  return (
    <MediumButton
      onPress={onPress}
      flexBasis={flexBasis}
      borderTopLeftRadius={borderTopLeftRadius}
      borderTopRightRadius={borderTopRightRadius}
      borderBottomLeftRadius={borderBottomLeftRadius}
      borderBottomRightRadius={borderBottomRightRadius}
      backgroundColor={backgroundColor}>
      <SmallText fontWeight={fontWeight} color={fontColor}>
        {text}
      </SmallText>
    </MediumButton>
  );
};
