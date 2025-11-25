import React from 'react';
import { ContentContainer } from '../layout/ContentContainer';
import { Color, ColorType } from '../../../constants/color.constant.ts';
import { IconName, SvgIcon } from './SvgIcon.tsx';
import { BodyTextB, Caption } from '../base/TextBase';
import { AdaptiveImage } from '../base/ImageBase';
import { TouchableOpacity } from 'react-native';

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
  editable?: boolean;
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
  editable = false,
}: CardProps) => {
  if (!photoUrls || photoUrls.length === 0) {
    return (
      <TouchableOpacity onPress={onPress}>
        <ContentContainer
          alignCenter
          backgroundColor={fallbackBackgroundColor}
          borderColor={fallbackBorderColor}
          borderRadius={20}
          withBorder
          width={width}
          height={height}
        >
          {fallbackIconName && <SvgIcon name={fallbackIconName} size={48} />}
          {fallbackText && (
            <BodyTextB color={Color.GREY_700}>{fallbackText}</BodyTextB>
          )}
        </ContentContainer>
      </TouchableOpacity>
    );
  }

  const count = photoUrls.length;
  return (
    <ContentContainer
      withBorder
      alignCenter
      width={width}
      height={height}
      borderRadius={20}
    >
      <TouchableOpacity onPress={onPress}>
        {/* Photo Part */}
        <ContentContainer
          flex={1}
          width={'100%'}
          height={'100%'}
          gap={0}
          borderRadius={20}
        >
          <ContentContainer
            useHorizontalLayout
            flex={1}
            width={'100%'}
            height={'100%'}
            gap={0}
          >
            <AdaptiveImage
              uri={photoUrls[0]}
              style={{ flex: 1 }}
              resizeMode="cover"
            />
            {count > 2 && (
              <AdaptiveImage
                uri={photoUrls[1]}
                style={{ flex: 1 }}
                resizeMode="cover"
              />
            )}
          </ContentContainer>
          {count > 1 && (
            <ContentContainer
              useHorizontalLayout
              flex={1}
              width={'100%'}
              height={'100%'}
              gap={0}
            >
              <AdaptiveImage
                uri={photoUrls[count === 2 ? 1 : 2]}
                style={{ flex: 1 }}
                resizeMode="cover"
              />
              {count > 3 && (
                <AdaptiveImage
                  uri={photoUrls[3]}
                  style={{ flex: 1 }}
                  resizeMode="cover"
                />
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
            alignCenter
          >
            <ContentContainer
              borderRadius={16}
              paddingHorizontal={10}
              paddingVertical={10}
              alignCenter
              backgroundColor={Color.GREY_800}
              opacity={0.8}
            >
              <Caption color={Color.WHITE}>+{count - 4}</Caption>
            </ContentContainer>
          </ContentContainer>
        )}
        {editable && (
          <ContentContainer
            width={'auto'}
            withNoBackground
            absoluteBottomPosition
            absoluteRightPosition
            paddingBottom={16}
            paddingRight={16}
          >
            <SvgIcon name={'cameraCircle'} size={40} />
          </ContentContainer>
        )}
      </TouchableOpacity>
    </ContentContainer>
  );
};
