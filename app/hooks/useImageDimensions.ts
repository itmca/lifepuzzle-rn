import { useEffect, useState } from 'react';
import { Image } from 'react-native';
import logger from '../utils/logger.util';

export type ImageDimension = {
  width: number;
  height: number;
};

type ImageSource = {
  uri: string;
  width?: number;
  height?: number;
  type?: string;
};

type UseImageDimensionsOptions = {
  defaultWidth: number;
  defaultHeight: number;
  skipVideoTypes?: boolean;
};

// Cache for failed image URLs to prevent repeated failed requests
const failedImageUrlsCache = new Set<string>();

/**
 * Custom hook to load image dimensions from an array of image sources
 *
 * @param sources - Array of image sources with optional pre-loaded dimensions
 * @param options - Configuration options for default dimensions and behavior
 * @returns Array of loaded image dimensions
 *
 * @example
 * // For gallery items
 * const dimensions = useImageDimensions(
 *   gallery.map(item => ({
 *     uri: item.url,
 *     width: item.width,
 *     height: item.height,
 *     type: item.type
 *   })),
 *   { defaultWidth: 400, defaultHeight: 300, skipVideoTypes: true }
 * );
 */
export const useImageDimensions = (
  sources: ImageSource[],
  options: UseImageDimensionsOptions,
): ImageDimension[] => {
  const { defaultWidth, defaultHeight, skipVideoTypes = false } = options;
  const [dimensions, setDimensions] = useState<ImageDimension[]>([]);

  useEffect(() => {
    const loadImageDimensions = async () => {
      const loadedDimensions = await Promise.all(
        sources.map(async (source): Promise<ImageDimension> => {
          // If dimensions are already provided, use them
          if (source.width && source.height) {
            return { width: source.width, height: source.height };
          }

          // Skip loading for videos if option is enabled
          if (skipVideoTypes && source.type === 'VIDEO') {
            return { width: defaultWidth, height: defaultHeight };
          }

          // Skip loading for non-IMAGE types if specified
          if (source.type && source.type !== 'IMAGE') {
            return { width: defaultWidth, height: defaultHeight };
          }

          // Skip if this URL has already failed before
          if (failedImageUrlsCache.has(source.uri)) {
            return { width: defaultWidth, height: defaultHeight };
          }

          // Load dimensions using Image.getSize
          try {
            return await new Promise<ImageDimension>((resolve, reject) => {
              Image.getSize(
                source.uri,
                (w, h) => resolve({ width: w, height: h }),
                reject,
              );
            });
          } catch (error) {
            // Add to cache to prevent repeated failed requests
            failedImageUrlsCache.add(source.uri);
            logger.debug(
              'Failed to get image size (cached for future skips):',
              source.uri,
            );
            return { width: defaultWidth, height: defaultHeight };
          }
        }),
      );
      setDimensions(loadedDimensions);
    };

    if (sources.length > 0) {
      loadImageDimensions();
    } else {
      setDimensions([]);
    }
  }, [sources, defaultWidth, defaultHeight, skipVideoTypes]);

  return dimensions;
};

/**
 * Custom hook to load a single image dimension
 *
 * @param source - Single image source with optional pre-loaded dimensions
 * @param options - Configuration options for default dimensions
 * @returns Loaded image dimension or null if not loaded
 *
 * @example
 * // For a single image
 * const dimension = useSingleImageDimension(
 *   { uri: imageUri, width: preloadedWidth, height: preloadedHeight },
 *   { defaultWidth: 400, defaultHeight: 300 }
 * );
 */
export const useSingleImageDimension = (
  source: ImageSource | null | undefined,
  options: UseImageDimensionsOptions,
): ImageDimension | null => {
  const { defaultWidth, defaultHeight } = options;
  const [dimension, setDimension] = useState<ImageDimension | null>(null);

  useEffect(() => {
    const loadImageDimension = async () => {
      if (!source) {
        setDimension(null);
        return;
      }

      // If dimensions are already provided, use them
      if (source.width && source.height) {
        setDimension({ width: source.width, height: source.height });
        return;
      }

      // Skip if this URL has already failed before
      if (failedImageUrlsCache.has(source.uri)) {
        setDimension({ width: defaultWidth, height: defaultHeight });
        return;
      }

      // Load dimensions using Image.getSize
      try {
        const loadedDimension = await new Promise<ImageDimension>(
          (resolve, reject) => {
            Image.getSize(
              source.uri,
              (w, h) => resolve({ width: w, height: h }),
              reject,
            );
          },
        );
        setDimension(loadedDimension);
      } catch (error) {
        // Add to cache to prevent repeated failed requests
        failedImageUrlsCache.add(source.uri);
        logger.debug(
          'Failed to get image size (cached for future skips):',
          source.uri,
        );
        setDimension({ width: defaultWidth, height: defaultHeight });
      }
    };

    loadImageDimension();
  }, [source, defaultWidth, defaultHeight]);

  return dimension;
};
