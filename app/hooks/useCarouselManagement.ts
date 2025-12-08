import { useCallback, useMemo, useRef } from 'react';
import { useImageDimensions } from './useImageDimensions';
import { calculateOptimalCarouselHeight } from '../utils/carousel-dimension.util';
import logger from '../utils/logger.util';

export interface CarouselItem {
  uri: string;
  width?: number;
  height?: number;
  type?: string;
}

export interface UseCarouselManagementOptions<T> {
  /** 갤러리 아이템 배열 */
  items: T[];
  /** 현재 선택된 인덱스 */
  currentIndex: number;
  /** 인덱스 설정 함수 */
  setIndex: (index: number) => void;
  /** Carousel 너비 */
  carouselWidth: number;
  /** Carousel 최대 높이 */
  maxCarouselHeight: number;
  /** 아이템에서 URI와 dimensions를 추출하는 함수 */
  getItemSource: (item: T) => CarouselItem;
  /** 첫 번째 아이템의 고유 식별자를 추출하는 함수 (key 생성용) */
  getFirstItemKey: (item: T) => string;
  /** useImageDimensions 옵션 */
  imageDimensionsOptions?: {
    defaultWidth?: number;
    defaultHeight?: number;
    skipVideoTypes?: boolean;
  };
  /** 삭제 중 플래그 ref (선택적, handleScroll 보호용) */
  isDeletingRef?: React.MutableRefObject<boolean>;
  /** 디버깅용 이름 */
  debugName?: string;
}

export interface UseCarouselManagementReturn {
  /** Carousel key (리마운트 제어용) */
  carouselKey: string;
  /** 최적화된 Carousel 높이 */
  optimalCarouselHeight: number;
  /** 각 아이템의 이미지 dimensions */
  imageDimensions: Array<{ width: number; height: number }>;
  /** Carousel scroll 핸들러 */
  handleScroll: (index: number) => void;
}

/**
 * Carousel 관리를 위한 공통 로직을 제공하는 Hook
 *
 * - 이미지 dimensions 계산
 * - 최적 Carousel 높이 계산
 * - Carousel key 생성 (리마운트 제어)
 * - handleScroll 로직
 *
 * @example
 * const { carouselKey, optimalCarouselHeight, imageDimensions, handleScroll } =
 *   useCarouselManagement({
 *     items: editGalleryItems,
 *     currentIndex: galleryIndex,
 *     setIndex: setGalleryIndex,
 *     carouselWidth: CAROUSEL_WIDTH_PADDED,
 *     maxCarouselHeight: MAX_PHOTO_EDITOR_CAROUSEL_HEIGHT,
 *     getItemSource: (item) => ({
 *       uri: item.node.image.uri,
 *       width: item.node.image.width,
 *       height: item.node.image.height,
 *     }),
 *     getFirstItemKey: (item) => item.node.image.uri,
 *     debugName: 'PhotoEditor',
 *   });
 */
export function useCarouselManagement<T>({
  items,
  currentIndex,
  setIndex,
  carouselWidth,
  maxCarouselHeight,
  getItemSource,
  getFirstItemKey,
  imageDimensionsOptions,
  isDeletingRef,
  debugName = 'Carousel',
}: UseCarouselManagementOptions<T>): UseCarouselManagementReturn {
  // 쓰로틀링을 위한 ref (필요시 사용)
  const lastScrollTimeRef = useRef<number>(0);

  // 이미지 소스 추출
  const imageSources = useMemo(
    () => items.map(item => getItemSource(item)),
    [items, getItemSource],
  );

  // 이미지 dimensions 계산
  const imageDimensions = useImageDimensions(imageSources, {
    defaultWidth: imageDimensionsOptions?.defaultWidth ?? carouselWidth,
    defaultHeight: imageDimensionsOptions?.defaultHeight ?? maxCarouselHeight,
    skipVideoTypes: imageDimensionsOptions?.skipVideoTypes,
  });

  // 최적 Carousel 높이 계산
  const optimalCarouselHeight = useMemo(
    () =>
      calculateOptimalCarouselHeight(
        imageDimensions,
        carouselWidth,
        maxCarouselHeight,
      ),
    [imageDimensions, carouselWidth, maxCarouselHeight],
  );

  // Carousel key 생성 (배열 길이 + 첫 번째 아이템 식별자)
  const carouselKey = useMemo(() => {
    const firstKey = items.length > 0 ? getFirstItemKey(items[0]) : 'empty';
    return `carousel-${items.length}-${firstKey}`;
  }, [items, getFirstItemKey]);

  // Scroll 핸들러
  const handleScroll = useCallback(
    (index: number) => {
      if (items.length === 0) {
        return;
      }

      // 삭제 중일 때는 onScroll 무시 (Carousel 리마운트 시 잘못된 인덱스 설정 방지)
      if (isDeletingRef?.current) {
        logger.debug(`[${debugName}] onScroll ignored during deletion:`, index);
        return;
      }

      logger.debug(
        `[${debugName}] onScroll called:`,
        index,
        'current:',
        currentIndex,
      );

      const safeIndex = index % items.length;
      setIndex(safeIndex);
    },
    [items.length, setIndex, currentIndex, isDeletingRef, debugName],
  );

  return {
    carouselKey,
    optimalCarouselHeight,
    imageDimensions,
    handleScroll,
  };
}
