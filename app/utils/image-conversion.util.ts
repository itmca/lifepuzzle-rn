import RNHeicConverter from 'react-native-heic-converter';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

export interface OptimizeImageOptions {
  quality?: number; // 0-100, default 80
  maxWidth?: number; // maximum width, optional
  maxHeight?: number; // maximum height, optional
  format?: 'JPEG' | 'PNG'; // output format, default JPEG
}

export interface OptimizedImageResult {
  uri: string;
  fileName: string;
  fileSize?: number;
}

export const imageConversionUtil = {
  /**
   * Optimize image with compression and optional resizing
   * Supports HEIC, JPEG, PNG input formats
   * @param imageUri Original image URI
   * @param fileName Original or desired file name
   * @param options Optimization options
   * @returns Promise with optimized image result
   */
  async optimizeImage(
    imageUri: string,
    fileName: string,
    options: OptimizeImageOptions = {},
  ): Promise<OptimizedImageResult> {
    const {
      quality = 80,
      maxWidth = 1920,
      maxHeight = 1920,
      format = 'JPEG',
    } = options;

    try {
      let processedUri = imageUri;
      let processedFileName = fileName;

      // Convert HEIC to JPEG if needed
      if (this.isHeicFile(fileName)) {
        const heicResult = await RNHeicConverter.convert({ path: imageUri });

        if (!heicResult.success) {
          throw new Error(`HEIC conversion failed: ${heicResult.error}`);
        }

        processedUri = heicResult.path;
        processedFileName = fileName.replace(/\.heic$/i, '.jpg');
      }

      const cleanFileName = this.generateCleanFileName(
        processedFileName,
        format,
      );

      const result = await ImageResizer.createResizedImage(
        processedUri,
        maxWidth,
        maxHeight,
        format,
        quality,
        0,
        undefined,
        false,
        {
          mode: 'contain',
          onlyScaleDown: true,
        },
      );

      return {
        uri: result.uri,
        fileName: cleanFileName,
        fileSize: result.size,
      };
    } catch (error) {
      throw new Error(`Image optimization failed: ${error}`);
    }
  },

  /**
   * Check if file is HEIC format
   * @param fileName File name to check
   * @returns True if HEIC file
   */
  isHeicFile(fileName: string): boolean {
    return /\.(heic|heif)$/i.test(fileName);
  },

  /**
   * Get image dimensions
   * @param imageUri Image URI
   * @returns Image size
   */
  async getImageSize(
    imageUri: string,
  ): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const Image = require('react-native').Image;
      Image.getSize(
        imageUri,
        (width: number, height: number) => resolve({ width, height }),
        (error: Error) => reject(error),
      );
    });
  },

  /**
   * Calculate resize ratio to fit within max dimensions
   * @param width Original width
   * @param height Original height
   * @param maxWidth Maximum width
   * @param maxHeight Maximum height
   * @returns Resize ratio (1.0 = no resize, <1.0 = downscale)
   */
  calculateResizeRatio(
    width: number,
    height: number,
    maxWidth?: number,
    maxHeight?: number,
  ): number {
    let ratio = 1.0;

    if (maxWidth && width > maxWidth) {
      ratio = Math.min(ratio, maxWidth / width);
    }

    if (maxHeight && height > maxHeight) {
      ratio = Math.min(ratio, maxHeight / height);
    }

    return ratio;
  },

  /**
   * Generate clean filename from original filename, preserving original name
   * @param originalFileName Original filename
   * @param format Target format
   * @returns Clean filename with proper extension
   */
  generateCleanFileName(
    originalFileName: string,
    format: 'JPEG' | 'PNG',
  ): string {
    const nameWithoutExt = originalFileName.replace(/\.[^/.]+$/, '');
    const extension = format === 'JPEG' ? 'jpg' : 'png';

    // If the original already has the right extension, keep it as-is
    if (originalFileName.toLowerCase().endsWith(`.${extension}`)) {
      return originalFileName;
    }

    // Otherwise, replace extension
    return `${nameWithoutExt}.${extension}`;
  },

  /**
   * Convert base64 string to Uint8Array
   * @param base64Data Base64 string
   * @returns Uint8Array
   */
  base64ToUint8Array(base64Data: string): Uint8Array {
    // React Native polyfill for atob
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let str = base64Data.replace(/=+$/, '');
    let output = '';

    for (let bc = 0, bs = 0, buffer = 0, i = 0; i < str.length; i++) {
      buffer = (buffer << 6) | chars.indexOf(str[i]);
      bc += 6;
      if (bc >= 8) {
        output += String.fromCharCode((buffer >> (bc -= 8)) & 0xff);
      }
    }
    const binaryString = output;
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes;
  },

  /**
   * Safely read image file as Uint8Array for upload
   * Works on both Android and iOS
   * @param imageUri Local image URI
   * @returns Promise with Uint8Array data
   */
  async readImageAsUint8Array(imageUri: string): Promise<Uint8Array> {
    try {
      const response = await fetch(imageUri);
      return new Uint8Array(await response.arrayBuffer());
    } catch (fetchError) {
      if (Platform.OS === 'android') {
        try {
          const base64Data = await RNFS.readFile(imageUri, 'base64');
          return this.base64ToUint8Array(base64Data);
        } catch (rnfsError) {
          throw new Error(`Both fetch and RNFS methods failed: ${fetchError}`);
        }
      } else {
        throw new Error(`Fetch failed: ${fetchError}`);
      }
    }
  },

  /**
   * Validate image file integrity
   * @param imageUri Image URI to validate
   * @returns Promise with validation result
   */
  async validateImage(imageUri: string): Promise<boolean> {
    try {
      const { width, height } = await this.getImageSize(imageUri);
      return width > 0 && height > 0;
    } catch {
      return false;
    }
  },
};
