import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SvgIcon } from '../../../../components/ui/display/SvgIcon';
import { ContentContainer } from '../../../../components/ui/layout/ContentContainer.tsx';
import { useMediaStore } from '../../../../stores/media.store';
import { useSelectionStore } from '../../../../stores/selection.store';
import { Color } from '../../../../constants/color.constant.ts';
import { Title } from '../../../../components/ui/base/TextBase';
import { ButtonBase } from '../../../../components/ui/base/ButtonBase';

type Variant = 'upload' | 'aiHistory';
type Props = { onPress: () => void };

const getVariantConfig = (variant: Variant, disabled: boolean) => {
  if (variant === 'aiHistory') {
    return {
      text: '작업 내역',
      textColor: disabled ? Color.GREY_300 : Color.AI_500,
      backgroundColor: disabled ? Color.GREY_100 : Color.WHITE,
      borderColor: disabled ? Color.GREY_200 : Color.AI_500,
      borderInside: true as const,
      borderWidth: 1,
      icon: undefined as const,
      iconColor: undefined as const,
    };
  }

  return {
    text: '사진/동영상 추가하기',
    textColor: disabled ? Color.GREY_300 : Color.WHITE,
    backgroundColor: disabled ? Color.GREY_100 : Color.MAIN_DARK,
    borderColor: undefined as const,
    borderInside: undefined as const,
    borderWidth: undefined as const,
    icon: 'camera' as const,
    iconColor: disabled ? Color.GREY_300 : Color.WHITE,
  };
};

const GalleryBottomButton = ({ onPress }: Props) => {
  const insets = useSafeAreaInsets();
  const selectedTag = useSelectionStore(state => state.selectedTag);
  const isGalleryError = useMediaStore(state => state.galleryError);

  const variant: Variant =
    selectedTag?.key === 'AI_PHOTO' ? 'aiHistory' : 'upload';
  const isDisabled = Boolean(isGalleryError);
  const config = getVariantConfig(variant, isDisabled);

  return (
    <ContentContainer
      paddingHorizontal={20}
      paddingBottom={insets.bottom + 16}
      backgroundColor="transparent"
    >
      <ButtonBase
        height={'56px'}
        width={'100%'}
        backgroundColor={config.backgroundColor}
        borderColor={config.borderColor}
        borderInside={config.borderInside}
        borderWidth={config.borderWidth}
        borderRadius={6}
        onPress={isDisabled ? undefined : onPress}
      >
        <ContentContainer
          gap={config.icon ? 8 : 0}
          useHorizontalLayout={!!config.icon}
          backgroundColor="transparent"
          alignCenter
        >
          {config.icon ? (
            <SvgIcon
              name={config.icon}
              size={24}
              color={config.iconColor ?? Color.WHITE}
            />
          ) : null}
          <Title color={config.textColor}>{config.text}</Title>
        </ContentContainer>
      </ButtonBase>
    </ContentContainer>
  );
};

export default GalleryBottomButton;
