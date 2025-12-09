import { useMemo } from 'react';
import { GalleryType } from '../types/core/media.type';
import { GalleryIndexUtils } from '../utils/gallery-index.util';

/**
 * Custom hook for mapping between filtered and full gallery indices
 *
 * @param allGallery - Full gallery array
 * @param filteredGallery - Filtered gallery array
 * @param allGalleryIndex - Current index in the full gallery
 * @returns Filtered index corresponding to the current full gallery index
 */
export const useGalleryIndexMapping = (
  allGallery: GalleryType[],
  filteredGallery: GalleryType[],
  allGalleryIndex: number,
): number => {
  const filteredIndex = useMemo(() => {
    return GalleryIndexUtils.toFilteredIndex(
      allGallery,
      filteredGallery,
      allGalleryIndex,
    );
  }, [allGallery, filteredGallery, allGalleryIndex]);

  return filteredIndex;
};
