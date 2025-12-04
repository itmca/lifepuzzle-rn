import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons.js';

import { ContentContainer } from '../../../../components/ui/layout/ContentContainer';
import { Color } from '../../../../constants/color.constant';
import { BodyTextB } from '../../../../components/ui/base/TextBase.tsx';
import { EDITOR_ACTION_BUTTON } from '../constants/editor.constant';

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
        opacity: disabled
          ? EDITOR_ACTION_BUTTON.DISABLED_OPACITY
          : EDITOR_ACTION_BUTTON.ENABLED_OPACITY,
      }}
      onPress={onPress}
      disabled={disabled}
    >
      <ContentContainer
        useHorizontalLayout
        justifyContent={'center'}
        alignItems={'center'}
        gap={EDITOR_ACTION_BUTTON.GAP}
        withBorder
        backgroundColor={Color.WHITE}
        paddingHorizontal={EDITOR_ACTION_BUTTON.PADDING_HORIZONTAL}
        paddingVertical={EDITOR_ACTION_BUTTON.PADDING_VERTICAL}
        width={EDITOR_ACTION_BUTTON.WIDTH}
        height={EDITOR_ACTION_BUTTON.HEIGHT}
        borderRadius={EDITOR_ACTION_BUTTON.BORDER_RADIUS}
      >
        <Icon
          name={icon}
          size={EDITOR_ACTION_BUTTON.ICON_SIZE}
          color={iconColor}
        />
        <BodyTextB color={textColor}>{label}</BodyTextB>
      </ContentContainer>
    </TouchableOpacity>
  );
};
