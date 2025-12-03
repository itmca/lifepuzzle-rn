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
  const iconColor = disabled ? Color.GREY_400 : Color.BLACK;
  const textColor = disabled ? Color.GREY_400 : Color.BLACK;

  return (
    <TouchableOpacity
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.5 : 1,
      }}
      onPress={onPress}
      disabled={disabled}
    >
      <ContentContainer
        useHorizontalLayout
        justifyContent={'center'}
        alignItems={'center'}
        gap={12}
        withBorder
        backgroundColor={Color.WHITE}
        paddingHorizontal={20}
        paddingVertical={14}
        width={168}
        height={62}
        borderRadius={16}
      >
        <Icon name={icon} size={20} color={iconColor} />
        <BodyTextB color={textColor}>{label}</BodyTextB>
      </ContentContainer>
    </TouchableOpacity>
  );
};
