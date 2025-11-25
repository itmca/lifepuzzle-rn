import React from 'react';
import { Image as RNImage, ImageRequireSource, Platform } from 'react-native';

import styled from 'styled-components/native';
import FastImage, { Source } from '@d11/react-native-fast-image';

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
  width: ${({ width }) => (width ? `${width}px` : '100%')};
  height: ${({ height }) => (height ? `${height}px` : '100%')};
  border-radius: ${({ borderRadius }) =>
    borderRadius ? `${borderRadius}px` : '0px'};
  resize-mode: ${({ resizeMode }) => (resizeMode ? `${resizeMode}` : 'cover')};
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
};

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
}: AdaptiveImageProps): React.ReactElement => {
  // 로컬 asset identifier인 경우 React Native 기본 Image 사용
  if (isLocalAssetUri(uri)) {
    return (
      <RNImage
        source={{ uri }}
        style={[
          style,
          {
            width: width || '100%',
            height: height || '100%',
            borderRadius,
          },
        ]}
        resizeMode={resizeMode}
      />
    );
  }

  // 그 외의 경우 FastImage 기반 FastImagePhoto 컴포넌트 사용
  return (
    <FastImagePhoto
      source={{ uri }}
      style={style}
      width={typeof width === 'number' ? width : undefined}
      height={typeof height === 'number' ? height : undefined}
      borderRadius={borderRadius}
      resizeMode={resizeMode}
    />
  );
};
