import { GalleryType } from '../types/core/media.type';

/**
 * Gallery index calculation utilities
 * Handles conversion between filtered and full gallery indices
 */
export class GalleryIndexUtils {
  /**
   * Convert full gallery index to filtered gallery index
   *
   * @param allGallery - Full gallery array
   * @param filteredGallery - Filtered gallery array
   * @param allGalleryIndex - Index in the full gallery
   * @returns Index in the filtered gallery, or 0 if not found
   */
  static toFilteredIndex(
    allGallery: GalleryType[],
    filteredGallery: GalleryType[],
    allGalleryIndex: number,
  ): number {
    if (filteredGallery.length === 0) {
      return 0;
    }

    const currentItem = allGallery[allGalleryIndex];
    const idx =
      currentItem && currentItem.tag?.key !== 'AI_PHOTO'
        ? filteredGallery.findIndex(item => item.id === currentItem.id)
        : -1;

    const safeIdx = idx < 0 ? 0 : idx;
    return Math.min(safeIdx, filteredGallery.length - 1);
  }

  /**
   * Convert filtered gallery index to full gallery index
   *
   * @param allGallery - Full gallery array
   * @param filteredGallery - Filtered gallery array
   * @param filteredIndex - Index in the filtered gallery
   * @returns Index in the full gallery, or -1 if not found
   */
  static toFullIndex(
    allGallery: GalleryType[],
    filteredGallery: GalleryType[],
    filteredIndex: number,
  ): number {
    if (
      filteredIndex < 0 ||
      filteredIndex >= filteredGallery.length ||
      allGallery.length === 0
    ) {
      return -1;
    }

    const targetItem = filteredGallery[filteredIndex];
    return allGallery.findIndex(item => item.id === targetItem.id);
  }

  /**
   * Calculate next index after item deletion
   *
   * @param updatedGallery - Gallery array after deletion
   * @param filteredGallery - Filtered gallery array after deletion
   * @param removedIndex - Index of removed item in full gallery
   * @param removedFilteredIndex - Index of removed item in filtered gallery
   * @returns Next index in the full gallery
   */
  static calculateNextIndexAfterDeletion(
    updatedGallery: GalleryType[],
    filteredGallery: GalleryType[],
    removedIndex: number,
    removedFilteredIndex: number,
  ): number {
    if (filteredGallery.length === 0) {
      return 0;
    }

    // Start with the removed filtered index
    let targetFilteredIndex =
      removedFilteredIndex >= 0
        ? removedFilteredIndex
        : filteredGallery.length - 1;

    // Clamp to valid range
    if (targetFilteredIndex >= filteredGallery.length) {
      targetFilteredIndex = filteredGallery.length - 1;
    }

    // Find the target item in filtered gallery
    const targetItem = filteredGallery[targetFilteredIndex];

    // Convert to full gallery index
    const nextIndex = updatedGallery.findIndex(
      item => item.id === targetItem.id,
    );

    // Fallback to clamped removedIndex if not found
    const clampedIndex =
      nextIndex >= 0
        ? nextIndex
        : Math.max(Math.min(removedIndex, filteredGallery.length - 1), 0);

    return clampedIndex;
  }

  /**
   * Check if index is valid for the given gallery
   *
   * @param gallery - Gallery array
   * @param index - Index to check
   * @returns true if index is valid
   */
  static isValidIndex(gallery: GalleryType[], index: number): boolean {
    return index >= 0 && index < gallery.length;
  }

  /**
   * Clamp index to valid range
   *
   * @param gallery - Gallery array
   * @param index - Index to clamp
   * @returns Clamped index
   */
  static clampIndex(gallery: GalleryType[], index: number): number {
    if (gallery.length === 0) {
      return 0;
    }
    return Math.max(0, Math.min(index, gallery.length - 1));
  }
}
