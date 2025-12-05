import React, { useCallback, useEffect, useRef } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import Carousel from 'react-native-reanimated-carousel';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';

import { AdaptiveImage } from '../../../../components/ui/base/ImageBase';
import { ContentContainer } from '../../../../components/ui/layout/ContentContainer';
import { SvgIcon } from '../../../../components/ui/display/SvgIcon';
import {
  DEFAULT_CAROUSEL_HEIGHT,
  CAROUSEL_MODE_CONFIG,
  CAROUSEL_WINDOW_SIZE,
  CAROUSEL_SCROLL_THROTTLE_MS,
} from '../../../../constants/carousel.constant';
import { Color } from '../../../../constants/color.constant';
import { calculateContainDimensions } from '../../../../utils/carousel-dimension.util';

type Props = {
  data: MediaItem[];
  activeIndex?: number;
  carouselMaxHeight?: number;
  carouselWidth: number;
  onScroll?: (index: number) => void;
  onRemove?: (index: number) => void;
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
  carouselMaxHeight = DEFAULT_CAROUSEL_HEIGHT,
  onScroll,
  onRemove,
}: Props): React.ReactElement => {
  const resolvedCarouselHeight =
    carouselMaxHeight && carouselMaxHeight > 0
      ? carouselMaxHeight
      : DEFAULT_CAROUSEL_HEIGHT;
  const safeActiveIndex = Math.min(
    Math.max(activeIndex ?? 0, 0),
    Math.max(data.length - 1, 0),
  );

  const carouselRef = useRef<ICarouselInstance>(null);

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
    // Check if data has actually changed by comparing URLs
    const prevUrls = prevDataRef.current.map(item => item.url).join(',');
    const currentUrls = data.map(item => item.url).join(',');

    if (prevUrls === currentUrls) {
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

  // 외부 인덱스 변경 시 캐러셀 위치 동기화 (삭제 등으로 인덱스 보정)
  useEffect(() => {
    if (!carouselRef.current) {
      return;
    }

    const frameId = requestAnimationFrame(() => {
      const currentIndex = carouselRef.current?.getCurrentIndex?.();
      if (
        typeof currentIndex === 'number' &&
        currentIndex !== safeActiveIndex
      ) {
        carouselRef.current?.scrollTo?.({
          index: safeActiveIndex,
          animated: false,
        });
      }
    });

    return () => cancelAnimationFrame(frameId);
  }, [safeActiveIndex, data.length]);

  const renderItem = useCallback(
    ({ item }: { item: MediaItem }) => {
      const mediaUrl = item.url;

      // 이미지 실제 표시 크기 계산 (contain mode)
      const displayDimensions =
        item.width && item.height
          ? calculateContainDimensions(
              item.width,
              item.height,
              carouselWidth,
              resolvedCarouselHeight,
            )
          : { width: carouselWidth, height: resolvedCarouselHeight };

      const displayWidth = displayDimensions.width;
      const displayHeight = displayDimensions.height;

      return (
        <ContentContainer flex={1} alignItems="center" justifyContent="center">
          <View
            style={{
              width: displayWidth,
              height: displayHeight,
              borderRadius: 8,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            {onRemove && typeof item.index === 'number' && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => onRemove(item.index as number)}
              >
                <SvgIcon name="closeWhite" size={16} color={Color.WHITE} />
              </TouchableOpacity>
            )}
            <AdaptiveImage
              uri={mediaUrl}
              style={styles.image}
              resizeMode="contain"
              borderRadius={0}
            />
          </View>
        </ContentContainer>
      );
    },
    [carouselWidth, resolvedCarouselHeight],
  );

  // 쓰로틀된 onScroll 핸들러
  const handleProgressChange = useCallback(
    (_: number, absoluteProgress: number) => {
      if (!onScroll) return;

      const now = Date.now();
      if (now - lastScrollTimeRef.current >= CAROUSEL_SCROLL_THROTTLE_MS) {
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
        key={`${data.length}-${safeActiveIndex}`}
        ref={carouselRef}
        style={{ alignSelf: 'center' }}
        loop={false}
        width={carouselWidth}
        height={resolvedCarouselHeight}
        data={data}
        mode="parallax"
        windowSize={CAROUSEL_WINDOW_SIZE}
        modeConfig={CAROUSEL_MODE_CONFIG}
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
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
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
      prevProps.onScroll === nextProps.onScroll &&
      prevProps.onRemove === nextProps.onRemove
    );
  },
);
