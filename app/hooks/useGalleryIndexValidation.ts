import { useEffect } from 'react';
import logger from '../utils/logger';

/**
 * 갤러리 아이템 배열 변경 시 현재 인덱스가 유효한지 검증하고 자동으로 조정합니다.
 *
 * @param items - 갤러리 아이템 배열
 * @param currentIndex - 현재 선택된 인덱스
 * @param setIndex - 인덱스 설정 함수
 * @param debugName - 디버깅용 이름 (로그에 표시)
 *
 * @example
 * useGalleryIndexValidation({
 *   items: editGalleryItems,
 *   currentIndex: galleryIndex,
 *   setIndex: setGalleryIndex,
 *   debugName: 'PhotoEditor',
 * });
 */
export function useGalleryIndexValidation<T>({
  items,
  currentIndex,
  setIndex,
  debugName = 'Gallery',
}: {
  items: T[];
  currentIndex: number;
  setIndex: (index: number) => void;
  debugName?: string;
}): void {
  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    // 현재 인덱스가 범위를 벗어나면 조정
    if (currentIndex >= items.length) {
      const nextIndex = Math.max(items.length - 1, 0);
      if (nextIndex !== currentIndex) {
        logger.debug(
          `[${debugName}] Index out of bounds, adjusting:`,
          currentIndex,
          '->',
          nextIndex,
        );
        setIndex(nextIndex);
      }
    }
  }, [items, currentIndex, setIndex, debugName]);
}
