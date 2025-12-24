import React from 'react';
import Icon from '@react-native-vector-icons/material-icons';
import { Color } from '../../../../constants/color.constant.ts';
import { ButtonBase } from '../../../../components/ui/base/ButtonBase.tsx';

type Props = {
  onPress: () => void;
};

export const ShareButton = ({ onPress }: Props): React.ReactElement => {
  return (
    <ButtonBase
      onPress={onPress}
      width={'auto'}
      height={'auto'}
      paddingVertical={6}
      paddingHorizontal={6}
      borderRadius={16}
      backgroundColor={Color.GREY_300}
      style={{ opacity: 0.7 }}
    >
      <Icon name={'share'} color={Color.WHITE} size={12} />
    </ButtonBase>
  );
};
