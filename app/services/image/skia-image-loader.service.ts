import RNFS from 'react-native-fs';
import { Skia, SkImage } from '@shopify/react-native-skia';
import { logger } from '../../utils/logger.util';
/**
 * Service for loading images into Skia format
 * Handles platform-specific image loading for both Android and iOS
 */

/**
 * Load an image from a URI into Skia format
 *
 * @param uri - Image URI (file://, http://, or platform-specific URI)
 * @returns SkImage object or null if loading fails
 *
 * @example
 * const skImage = await loadSkiaImage('file:///path/to/image.jpg');
 * if (skImage) {
 *   // Use skImage with Skia canvas
 * }
 */
export async function loadSkiaImage(uri: string): Promise<SkImage | null> {
  try {
    let buffer: ArrayBuffer;

    // Both Android and iOS file:// URIs need RNFS (fetch doesn't work on iOS for file://)
    if (uri.startsWith('file://')) {
      buffer = await loadFileUri(uri);
    } else {
      // Network URLs use fetch
      buffer = await loadWithFetch(uri);
    }

    const skData = Skia.Data.fromBytes(new Uint8Array(buffer));
    const skImage = Skia.Image.MakeImageFromEncoded(skData);

    return skImage ?? null;
  } catch (err) {
    logger.error('[skia-image-loader] Failed to load Skia image:', err);
    return null;
  }
}

/**
 * Load file:// URI using RNFS and convert to ArrayBuffer
 * This is necessary because both iOS and Android cannot fetch file:// URIs directly
 *
 * @param uri - File URI starting with 'file://'
 * @returns ArrayBuffer containing image data
 */
async function loadFileUri(uri: string): Promise<ArrayBuffer> {
  const filePath = uri.replace('file://', '');
  const base64Data = await RNFS.readFile(filePath, 'base64');

  // Convert base64 to ArrayBuffer
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer;
}

/**
 * Load image using fetch API (for network URLs only)
 *
 * @param uri - Network image URI (http:// or https://)
 * @returns ArrayBuffer containing image data
 */
async function loadWithFetch(uri: string): Promise<ArrayBuffer> {
  const response = await fetch(uri);
  return await response.arrayBuffer();
}
