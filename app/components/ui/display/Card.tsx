import React from 'react';
import { ContentContainer } from '../layout/ContentContainer';
import { Color, ColorType } from '../../../constants/color.constant.ts';
import { IconName, SvgIcon } from './SvgIcon.tsx';
import { BodyTextB, Caption } from '../base/TextBase';
import { Photo } from '../base/ImageBase';
import { Image as RNImage, Platform, TouchableOpacity } from 'react-native';

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
  // ph:// URI를 렌더링하기 위한 헬퍼 함수
  const renderImage = (uri: string, style: any) => {
    // iOS에서 ph:// URI인 경우 React Native의 기본 Image 사용
    if (Platform.OS === 'ios' && uri.startsWith('ph://')) {
      return (
        <RNImage
          source={{ uri }}
          style={{
            flex: style.flex || 1,
            width: '100%',
            height: '100%',
            borderRadius: 0,
          }}
          resizeMode="cover"
        />
      );
    }
    // 그 외의 경우 FastImage 기반의 Photo 컴포넌트 사용
    return <Photo source={{ uri }} style={style} />;
  };

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
            {renderImage(photoUrls[0], { flex: 1 })}
            {count > 2 && renderImage(photoUrls[1], { flex: 1 })}
          </ContentContainer>
          {count > 1 && (
            <ContentContainer
              useHorizontalLayout
              flex={1}
              width={'100%'}
              height={'100%'}
              gap={0}
            >
              {renderImage(photoUrls[count === 2 ? 1 : 2], { flex: 1 })}
              {count > 3 && renderImage(photoUrls[3], { flex: 1 })}
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
