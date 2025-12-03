import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons.js';

import { ContentContainer } from '../../../../components/ui/layout/ContentContainer';
import { Color } from '../../../../constants/color.constant';
import { BodyTextB } from '../../../../components/ui/base/TextBase.tsx';

type EditorActionButtonProps = {
  icon: string;
  label: string;
  disabled?: boolean;
  onPress: () => void;
};

export const EditorActionButton = ({
  icon,
  label,
  disabled,
  onPress,
}: EditorActionButtonProps): React.ReactElement => {
  const contentColor = disabled ? Color.GREY_300 : Color.WHITE;

  return (
    <TouchableOpacity
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.3 : 1,
      }}
      onPress={onPress}
      disabled={disabled}
    >
      <ContentContainer
        justifyContent={'center'}
        alignItems={'center'}
        gap={4}
        withBorder
        backgroundColor={Color.GREY_800}
        paddingHorizontal={8}
        paddingVertical={8}
        width={80}
        height={64}
        borderRadius={16}
      >
        <Icon name={icon} size={20} color={contentColor} />
        <BodyTextB color={contentColor}>{label}</BodyTextB>
      </ContentContainer>
    </TouchableOpacity>
  );
};
