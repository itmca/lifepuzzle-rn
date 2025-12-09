import { useMemo } from 'react';
import { GalleryItem } from '../types/core/writing-story.type';
import { AgeGroupsType, TagKey } from '../types/core/media.type';
import { TagType } from '../types/core/media.type';
import { useSingleImageDimension } from './useImageDimensions';
import { calculateDisplayDimensions } from '../utils/carousel-dimension.util';

export type StoryWritingDimensionsResult = {
  imageSource: {
    uri: string;
    width?: number;
    height?: number;
  } | null;
  loadedDimension: { width: number; height: number } | null;
  imageDimensions: { width: number; height: number } | null;
  currentAgeGroup:
    | {
        startYear: number;
        endYear: number;
        galleryCount: number;
        gallery: any[];
      }
    | undefined;
  ageGroupStartDate: Date | undefined;
  ageGroupEndDate: Date | undefined;
  defaultTagIndex: number | undefined;
};

type UseStoryWritingDimensionsParams = {
  galleryItem: GalleryItem | undefined;
  ageGroups: AgeGroupsType | undefined;
  tags: TagType[] | undefined;
  containerWidth: number;
  maxHeight: number;
};

/**
 * Custom hook for managing image dimensions and age group calculations in StoryWritingPage
 * Consolidates complex memoization chains
 *
 * @param params - Configuration object
 * @returns Object containing all calculated dimensions and indices
 */
export const useStoryWritingDimensions = ({
  galleryItem,
  ageGroups,
  tags,
  containerWidth,
  maxHeight,
}: UseStoryWritingDimensionsParams): StoryWritingDimensionsResult => {
  // Memoize image source to prevent infinite re-renders in useSingleImageDimension
  const imageSource = useMemo(() => {
    if (!galleryItem) return null;
    return {
      uri: galleryItem.uri,
      width: galleryItem.width,
      height: galleryItem.height,
    };
  }, [galleryItem?.uri, galleryItem?.width, galleryItem?.height]);

  // Load image dimensions using custom hook
  const loadedDimension = useSingleImageDimension(imageSource, {
    defaultWidth: containerWidth,
    defaultHeight: maxHeight,
  });

  // Calculate display dimensions from loaded dimensions
  const imageDimensions = useMemo(() => {
    if (!loadedDimension) return null;
    return calculateDisplayDimensions(
      loadedDimension.width,
      loadedDimension.height,
      containerWidth,
      maxHeight,
    );
  }, [loadedDimension, containerWidth, maxHeight]);

  // Memoize age group calculations to prevent infinite re-renders
  const currentAgeGroup = useMemo(() => {
    return galleryItem ? ageGroups?.[galleryItem.tagKey] : undefined;
  }, [galleryItem?.tagKey, ageGroups]);

  const ageGroupStartDate = useMemo(() => {
    return currentAgeGroup
      ? new Date(currentAgeGroup.startYear, 0, 1)
      : undefined;
  }, [currentAgeGroup]);

  const ageGroupEndDate = useMemo(() => {
    return currentAgeGroup
      ? new Date(currentAgeGroup.endYear, 11, 31)
      : undefined;
  }, [currentAgeGroup]);

  // Find the index of the current tag for default selection
  const defaultTagIndex = useMemo(() => {
    if (!galleryItem || !tags) return undefined;
    return tags.findIndex(tag => tag.key === galleryItem.tagKey);
  }, [galleryItem?.tagKey, tags]);

  return {
    imageSource,
    loadedDimension,
    imageDimensions,
    currentAgeGroup,
    ageGroupStartDate,
    ageGroupEndDate,
    defaultTagIndex,
  };
};
