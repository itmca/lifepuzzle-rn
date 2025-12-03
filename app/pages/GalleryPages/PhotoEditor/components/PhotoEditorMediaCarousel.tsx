import React, { useCallback, useEffect, useRef } from 'react';
import { Platform, StyleSheet } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import Carousel from 'react-native-reanimated-carousel';

import { AdaptiveImage } from '../../../../components/ui/base/ImageBase';
import { ContentContainer } from '../../../../components/ui/layout/ContentContainer';

type Props = {
  data: MediaItem[];
  activeIndex?: number;
  carouselMaxHeight?: number;
  carouselWidth: number;
  onScroll?: (index: number) => void;
};

type MediaItem = {
  type: string;
  url: string;
  index?: number;
  width?: number;
  height?: number;
};

const PhotoEditorMediaCarouselComponent = ({
  data,
  activeIndex,
  carouselWidth,
  carouselMaxHeight = 376,
  onScroll,
}: Props): React.ReactElement => {
  const resolvedCarouselHeight =
    carouselMaxHeight && carouselMaxHeight > 0 ? carouselMaxHeight : 376;
  const safeActiveIndex = Math.min(
    Math.max(activeIndex ?? 0, 0),
    Math.max(data.length - 1, 0),
  );

  // 이전 데이터 참조를 저장하여 불필요한 preload 방지
  const prevDataRef = useRef<MediaItem[]>([]);
  // 쓰로틀링을 위한 ref
  const lastScrollTimeRef = useRef<number>(0);

  const isLocalAssetUri = useCallback((uri: string): boolean => {
    if (Platform.OS === 'ios' && uri.startsWith('ph://')) {
      return true;
    }
    if (Platform.OS === 'android' && uri.startsWith('content://')) {
      return true;
    }
    return false;
  }, []);

  // 모든 이미지를 미리 캐시에 로드 (데이터가 실제로 변경된 경우에만)
  useEffect(() => {
    if (JSON.stringify(prevDataRef.current) === JSON.stringify(data)) {
      return;
    }

    const imagesToPreload = data
      .filter(
        item => item.type === 'IMAGE' && item.url && !isLocalAssetUri(item.url),
      )
      .map(item => ({
        uri: item.url,
        priority: FastImage.priority.high,
      }));

    if (imagesToPreload.length > 0) {
      FastImage.preload(imagesToPreload);
    }

    prevDataRef.current = data;
  }, [data, isLocalAssetUri]);

  const renderItem = useCallback(
    ({ item }: { item: MediaItem }) => {
      const mediaUrl = item.url;

      // 이미지 실제 표시 크기 계산
      let displayWidth = carouselWidth;
      let displayHeight = resolvedCarouselHeight;

      if (item.width && item.height) {
        const aspectRatio = item.width / item.height;
        const containerAspectRatio = carouselWidth / resolvedCarouselHeight;

        if (aspectRatio > containerAspectRatio) {
          // 가로가 더 긴 이미지 - width를 기준으로 맞춤
          displayWidth = carouselWidth;
          displayHeight = carouselWidth / aspectRatio;
        } else {
          // 세로가 더 긴 이미지 - height를 기준으로 맞춤
          displayHeight = resolvedCarouselHeight;
          displayWidth = resolvedCarouselHeight * aspectRatio;
        }
      }

      return (
        <ContentContainer flex={1} alignItems="center" justifyContent="center">
          <ContentContainer
            width={displayWidth}
            height={displayHeight}
            borderRadius={8}
            showOverflow={false}
          >
            <AdaptiveImage
              uri={mediaUrl}
              style={styles.image}
              resizeMode="contain"
              borderRadius={0}
            />
          </ContentContainer>
        </ContentContainer>
      );
    },
    [carouselWidth, resolvedCarouselHeight],
  );

  // 쓰로틀된 onScroll 핸들러 (100ms)
  const handleProgressChange = useCallback(
    (_: number, absoluteProgress: number) => {
      if (!onScroll) return;

      const now = Date.now();
      if (now - lastScrollTimeRef.current >= 100) {
        lastScrollTimeRef.current = now;
        onScroll(Math.floor(absoluteProgress));
      }
    },
    [onScroll],
  );

  // 스냅 완료 시 호출되는 핸들러
  const handleSnapToItem = useCallback(
    (index: number) => {
      if (onScroll) {
        onScroll(index);
      }
    },
    [onScroll],
  );

  return (
    <>
      <Carousel
        style={{ alignSelf: 'center' }}
        loop={false}
        width={carouselWidth}
        height={resolvedCarouselHeight}
        data={data}
        mode="parallax"
        windowSize={3}
        modeConfig={{
          parallaxScrollingScale: 0.91,
          parallaxAdjacentItemScale: 0.91,
          parallaxScrollingOffset: 25,
        }}
        defaultIndex={safeActiveIndex}
        renderItem={renderItem}
        onProgressChange={handleProgressChange}
        onSnapToItem={handleSnapToItem}
      />
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
});

// React.memo로 불필요한 재렌더링 방지
export const PhotoEditorMediaCarousel = React.memo(
  PhotoEditorMediaCarouselComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.data === nextProps.data &&
      prevProps.activeIndex === nextProps.activeIndex &&
      prevProps.carouselWidth === nextProps.carouselWidth &&
      prevProps.carouselMaxHeight === nextProps.carouselMaxHeight &&
      prevProps.onScroll === nextProps.onScroll
    );
  },
);
