import { useEffect, useRef } from 'react';
import FastImage from '@d11/react-native-fast-image';

export type PreloadableItem = {
  url: string;
  type?: 'IMAGE' | 'VIDEO' | string;
};

/**
 * Custom hook for preloading images
 * Preloads images only when the data actually changes
 *
 * @param data - Array of items to preload
 * @returns void
 */
export const useImagePreloader = (data: PreloadableItem[]): void => {
  const prevDataRef = useRef<PreloadableItem[]>([]);

  useEffect(() => {
    // Check if data has actually changed by comparing URLs
    const prevUrls = prevDataRef.current.map(item => item.url).join(',');
    const currentUrls = data.map(item => item.url).join(',');

    if (prevUrls === currentUrls) {
      return;
    }

    const imagesToPreload = data
      .filter(item => item.type === 'IMAGE' && item.url)
      .map(item => ({
        uri: item.url,
        priority: FastImage.priority.high,
      }));

    if (imagesToPreload.length > 0) {
      FastImage.preload(imagesToPreload);
    }

    prevDataRef.current = data;
  }, [data]);
};
