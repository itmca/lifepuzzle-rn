import React, { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { ContentContainer } from '../../../../components/ui/layout/ContentContainer.tsx';
import { useMediaStore } from '../../../../stores/media.store';
import { useSelectionStore } from '../../../../stores/selection.store';
import { Color } from '../../../../constants/color.constant.ts';
import { Title } from '../../../../components/ui/base/TextBase';
import Icon from '../../../../components/ui/display/Icon.tsx';

type Variant = 'upload' | 'aiHistory';
type Props = { onPress: () => void };

const getVariantConfig = (variant: Variant, disabled: boolean) => {
  if (variant === 'aiHistory') {
    return {
      text: '작업 내역',
      textColor: disabled ? Color.GREY_300 : Color.AI_500,
      backgroundColor: disabled ? Color.GREY_100 : Color.WHITE,
      borderColor: disabled ? Color.GREY_200 : Color.AI_500,
      icon: undefined,
      iconColor: undefined,
    };
  }

  return {
    text: '사진/동영상 추가하기',
    textColor: disabled ? Color.GREY_300 : Color.WHITE,
    backgroundColor: disabled ? Color.GREY_100 : Color.MAIN_DARK,
    icon: 'plus' as const,
    iconColor: disabled ? Color.GREY_300 : Color.WHITE,
    borderColor: undefined,
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
  const sizeConfig = useMemo(
    () => ({
      width: variant === 'aiHistory' ? 140 : 56,
      height: 56,
      borderRadius: 28,
    }),
    [variant],
  );

  return (
    <ContentContainer
      absoluteBottomPosition
      absoluteRightPosition
      width={'auto'}
      paddingBottom={insets.bottom + 40}
      paddingRight={32}
      backgroundColor="transparent"
      zIndex={10}
    >
      <TouchableOpacity
        onPress={isDisabled ? undefined : onPress}
        activeOpacity={0.9}
        style={{
          width: sizeConfig.width,
          height: sizeConfig.height,
          borderRadius: sizeConfig.borderRadius,
          backgroundColor: config.backgroundColor,
          borderWidth: config.borderColor ? 1 : 0,
          borderColor: config.borderColor,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 8,
          elevation: 5,
        }}
        disabled={isDisabled}
      >
        {variant === 'aiHistory' ? (
          <Title color={config.textColor}>{config.text}</Title>
        ) : (
          <Icon name={'add'} size={40} color={Color.WHITE} />
        )}
      </TouchableOpacity>
    </ContentContainer>
  );
};

export default GalleryBottomButton;
