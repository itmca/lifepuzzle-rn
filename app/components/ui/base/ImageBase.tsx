import React, { useEffect, useMemo, useState } from 'react';
import {
  Image as RNImage,
  ImageRequireSource,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import styled from 'styled-components/native';
import FastImage, { Source } from '@d11/react-native-fast-image';
import { Color } from '../../../constants/color.constant';

type Props = {
  width?: number;
  height?: number;
  source: Source | ImageRequireSource;
  tintColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
};

/**
 * FastImagePhoto: FastImage 기반 내부 전용 컴포넌트
 * 외부에서는 AdaptiveImage를 사용하세요
 */
const FastImagePhoto = styled(FastImage)<Props>`
  width: ${({ width }: Props) => (width ? `${width}px` : '100%')};
  height: ${({ height }: Props) => (height ? `${height}px` : '100%')};
  border-radius: ${({ borderRadius }: Props) =>
    borderRadius ? `${borderRadius}px` : '0px'};
  resize-mode: ${({ resizeMode }: Props) =>
    resizeMode ? `${resizeMode}` : 'cover'};
`;

/**
 * AdaptiveImage: 로컬 asset identifier를 자동으로 감지하여 적절한 Image 컴포넌트 사용
 * - iOS ph:// URI: React Native 기본 Image
 * - Android content:// URI: React Native 기본 Image
 * - 그 외: FastImage 기반 FastImagePhoto 컴포넌트
 */
type AdaptiveImageProps = {
  uri: string;
  style?: any;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  onLoad?: (event: any) => void;
  fallbackText?: string;
  showFallbackText?: boolean;
  fallbackBackgroundColor?: string;
  sourceOptions?: Partial<Source>;
};

const DEFAULT_FALLBACK_TEXT = '이미지를 불러올 수 없어요';
const FORCE_IMAGE_FALLBACK_PREVIEW = false;

/**
 * 로컬 asset identifier인지 확인하는 헬퍼 함수
 */
const isLocalAssetUri = (uri: string): boolean => {
  if (Platform.OS === 'ios' && uri.startsWith('ph://')) {
    return true;
  }
  if (Platform.OS === 'android' && uri.startsWith('content://')) {
    return true;
  }
  return false;
};

export const AdaptiveImage = ({
  uri,
  style,
  width,
  height,
  borderRadius = 0,
  resizeMode = 'cover',
  onLoad,
  fallbackText = DEFAULT_FALLBACK_TEXT,
  showFallbackText = true,
  fallbackBackgroundColor,
  sourceOptions,
}: AdaptiveImageProps): React.ReactElement => {
  const [loadFailed, setLoadFailed] = useState(
    FORCE_IMAGE_FALLBACK_PREVIEW || !uri,
  );

  useEffect(() => {
    setLoadFailed(FORCE_IMAGE_FALLBACK_PREVIEW || !uri);
  }, [uri]);

  const resolvedDimensions = useMemo(() => {
    const resolvedWidth =
      width !== undefined ? width : ('100%' as number | string);
    const resolvedHeight =
      height !== undefined ? height : ('100%' as number | string);
    return { resolvedWidth, resolvedHeight };
  }, [width, height]);

  const combinedStyle = useMemo(
    () => [
      {
        width: resolvedDimensions.resolvedWidth,
        height: resolvedDimensions.resolvedHeight,
        borderRadius,
      },
      style,
    ],
    [borderRadius, resolvedDimensions, style],
  );

  const renderFallback = () => (
    <View
      style={[
        ...combinedStyle,
        styles.placeholderBase,
        {
          backgroundColor: fallbackBackgroundColor ?? Color.GREY_900,
        },
      ]}
    >
      {showFallbackText && (
        <Text style={styles.placeholderText} numberOfLines={2}>
          {fallbackText}
        </Text>
      )}
    </View>
  );

  if (!uri || loadFailed) {
    return renderFallback();
  }

  // 로컬 asset identifier인 경우 React Native 기본 Image 사용
  if (isLocalAssetUri(uri)) {
    return (
      <RNImage
        source={{ uri }}
        style={combinedStyle}
        resizeMode={resizeMode}
        onError={() => setLoadFailed(true)}
        onLoad={onLoad}
      />
    );
  }

  // 그 외의 경우 FastImage 기반 FastImagePhoto 컴포넌트 사용
  return (
    <FastImagePhoto
      source={{ uri, ...sourceOptions }}
      style={style}
      width={typeof width === 'number' ? width : undefined}
      height={typeof height === 'number' ? height : undefined}
      borderRadius={borderRadius}
      resizeMode={resizeMode}
      onError={() => setLoadFailed(true)}
      onLoad={onLoad}
    />
  );
};

const styles = StyleSheet.create({
  placeholderBase: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.GREY_900,
  },
  placeholderText: {
    color: Color.GREY_400,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});
