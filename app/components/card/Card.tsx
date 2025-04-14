import React from 'react';
import {ContentContainer} from '../styled/container/ContentContainer.tsx';
import {Color, ColorType} from '../../constants/color.constant.ts';
import {IconName, SvgIcon} from '../styled/components/SvgIcon.tsx';
import {BodyTextB, Caption} from '../styled/components/Text.tsx';
import {Photo} from '../styled/components/Image.tsx';
import {TouchableOpacity} from 'react-native';

type CardProps = {
  photoUrls?: string[];
  fallbackIconName?: IconName;
  fallbackText?: string;
  fallbackBackgroundColor?: ColorType;
  fallbackBorderColor?: ColorType;
  width?: number | 'auto' | `${number}%`;
  height?: number | 'auto' | `${number}%`;
  borderRadius?: number;
  onPress?: () => void;
};

export const BasicCard = ({
  photoUrls,
  fallbackIconName = 'pictureNone',
  fallbackText = '',
  fallbackBackgroundColor = Color.GREY,
  fallbackBorderColor = Color.GREY_100,
  width = '100%',
  height = '100%',
  onPress = () => {},
}: CardProps) => {
  if (!photoUrls || photoUrls.length === 0) {
    return (
      <ContentContainer
        alignCenter
        backgroundColor={fallbackBackgroundColor}
        borderColor={fallbackBorderColor}
        borderRadius={20}
        withBorder
        width={width}
        height={height}>
        {fallbackIconName && <SvgIcon name={fallbackIconName} size={48} />}
        {fallbackText && (
          <BodyTextB color={Color.GREY_700}>{fallbackText}</BodyTextB>
        )}
      </ContentContainer>
    );
  }

  const count = photoUrls.length;
  return (
    <ContentContainer
      withBorder
      alignCenter
      width={width}
      height={height}
      borderRadius={20}>
      <TouchableOpacity onPress={onPress}>
        {/* Photo Part */}
        <ContentContainer
          flex={1}
          width={'100%'}
          height={'100%'}
          gap={0}
          borderRadius={20}>
          <ContentContainer
            useHorizontalLayout
            flex={1}
            width={'100%'}
            height={'100%'}
            gap={0}>
            <Photo source={{uri: photoUrls[0]}} style={{flex: 1}} />
            {count > 2 && (
              <Photo source={{uri: photoUrls[1]}} style={{flex: 1}} />
            )}
          </ContentContainer>
          {count > 1 && (
            <ContentContainer
              useHorizontalLayout
              flex={1}
              width={'100%'}
              height={'100%'}
              gap={0}>
              <Photo
                source={{uri: photoUrls[count === 2 ? 1 : 2]}}
                style={{flex: 1}}
              />
              {count > 3 && (
                <Photo source={{uri: photoUrls[3]}} style={{flex: 1}} />
              )}
            </ContentContainer>
          )}
        </ContentContainer>
        {/* Photo Count Part */}
        {count > 4 && (
          <ContentContainer
            absoluteRightPosition
            absoluteBottomPosition
            paddingHorizontal={8}
            paddingVertical={8}
            backgroundColor="transparent"
            width={'auto'}
            alignCenter>
            <ContentContainer
              borderRadius={16}
              paddingHorizontal={10}
              paddingVertical={10}
              alignCenter
              backgroundColor={Color.GREY_800}
              opacity={0.8}>
              <Caption color={Color.WHITE}>+{count - 4}</Caption>
            </ContentContainer>
          </ContentContainer>
        )}
      </TouchableOpacity>
    </ContentContainer>
  );
};
