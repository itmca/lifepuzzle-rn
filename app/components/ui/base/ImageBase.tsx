import React from 'react';
import { ImageRequireSource, Image as RNImage, Platform } from 'react-native';

import styled, { css } from 'styled-components/native';
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

export const MediumImage = styled(FastImage)<Props>`
  width: ${({ width }) => (width ? `${width}px` : '33.94px')};
  height: ${({ height }) => (height ? `${height}px` : '100px')};
  justify-content: center;
  align-content: center;
  border-radius: ${({ borderRadius }) =>
    borderRadius ? `${borderRadius}px` : '0px'};
  resize-mode: ${({ resizeMode }) => (resizeMode ? `${resizeMode}` : 'cover')};
`;
export const SmallImage = styled(FastImage)<Props>`
  width: ${({ width }) => (width ? `${width}px` : '20px')};
  height: ${({ height }) => (height ? `${height}px` : '20px')};
  background-color: ${({ backgroundColor }) =>
    backgroundColor ? `${backgroundColor}` : 'transparent'};
  border-radius: ${({ borderRadius }) =>
    borderRadius ? `${borderRadius}px` : '0px'};
  ${props =>
    props.tintColor &&
    css`
      tint-color: ${props.tintColor};
    `};
`;
export const XSmallImage = styled(FastImage)<Props>`
  width: ${({ width }) => (width ? `${width}px` : '16px')};
  height: ${({ height }) => (height ? `${height}px` : '16px')};
  background-color: ${({ backgroundColor }) =>
    backgroundColor ? `${backgroundColor}` : 'transparent'};
  border-radius: ${({ borderRadius }) =>
    borderRadius ? `${borderRadius}px` : '0px'};
  ${props =>
    props.tintColor &&
    css`
      tint-color: ${props.tintColor};
    `};
`;

export const XXSmallImage = styled(FastImage)<Props>`
  width: ${({ width }) => (width ? `${width}px` : '14px')};
  height: ${({ height }) => (height ? `${height}px` : '14px')};
  background-color: ${({ backgroundColor }) =>
    backgroundColor ? `${backgroundColor}` : 'transparent'};
  border-radius: ${({ borderRadius }) =>
    borderRadius ? `${borderRadius}px` : '0px'};
  ${props =>
    props.tintColor &&
    css`
      tint-color: ${props.tintColor};
    `};
`;
export const LargeImage = styled(FastImage)<Props>`
  width: ${({ width }) => (width ? `${width}px` : '94px')};
  height: ${({ height }) => (height ? `${height}px` : '94px')};
  border-radius: 10px;
`;
export const Photo = styled(FastImage)<Props>`
  width: ${({ width }) => (width ? `${width}px` : '100%')};
  height: ${({ height }) => (height ? `${height}px` : '100%')};
  border-radius: ${({ borderRadius }) =>
    borderRadius ? `${borderRadius}px` : '0px'};
  resize-mode: ${({ resizeMode }) => (resizeMode ? `${resizeMode}` : 'cover')};
`;

function Image(props: Props) {
  return <MediumImage {...props} />;
}

export default Image;

/**
 * AdaptiveImage: 로컬 asset identifier를 자동으로 감지하여 적절한 Image 컴포넌트 사용
 * - iOS ph:// URI: React Native 기본 Image
 * - Android content:// URI: React Native 기본 Image
 * - 그 외: FastImage 기반 Photo 컴포넌트
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

  // 그 외의 경우 FastImage 기반 Photo 컴포넌트 사용
  return (
    <Photo
      source={{ uri }}
      style={style}
      width={typeof width === 'number' ? width : undefined}
      height={typeof height === 'number' ? height : undefined}
      borderRadius={borderRadius}
      resizeMode={resizeMode}
    />
  );
};
