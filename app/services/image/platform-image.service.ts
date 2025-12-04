import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import PhotoManipulator from 'react-native-photo-manipulator';
import { ExtendedPhotoIdentifier } from '../../types/ui/photo-selector.type';
import logger from '../../utils/logger';

/**
 * Service for handling platform-specific image operations
 * Converts platform-specific URIs (content://, ph://) to file:// URIs
 */

/**
 * Copy or convert platform-specific image URI to a standard file:// URI
 *
 * @param selectedImage - Photo identifier with platform-specific URI
 * @returns File URI (file://) that can be used across the app
 *
 * @example
 * // Android content URI
 * const fileUri = await copyContentUriToFile(androidImage);
 * // Returns: 'file:///data/user/0/.../cache/123456.jpg'
 *
 * @example
 * // iOS photo library URI
 * const fileUri = await copyContentUriToFile(iosImage);
 * // Returns: 'file:///var/mobile/.../tmp/123456.jpg'
 */
export async function copyContentUriToFile(
  selectedImage: ExtendedPhotoIdentifier,
): Promise<string> {
  const uri = selectedImage.node.image.uri;

  // Handle Android content:// URIs
  if (Platform.OS === 'android' && uri.startsWith('content://')) {
    return await copyAndroidContentUri(uri);
  }

  // Handle iOS photo library URIs (ph://)
  if (Platform.OS === 'ios' && uri.startsWith('ph://')) {
    return await copyIosPhotoLibraryUri(uri, selectedImage);
  }

  // Already a file:// URI or other standard format
  return uri;
}

/**
 * Copy Android content:// URI to temporary file
 *
 * @param uri - Android content URI
 * @returns File URI in temporary directory
 */
async function copyAndroidContentUri(uri: string): Promise<string> {
  const dest = `${RNFS.TemporaryDirectoryPath}/${Date.now()}.jpg`;
  try {
    await RNFS.copyFile(uri, dest);
    return `file://${dest}`;
  } catch (error) {
    logger.error('Failed to copy Android content URI:', error);
    throw error;
  }
}

/**
 * Copy iOS photo library URI (ph://) to temporary file using PhotoManipulator
 * PhotoManipulator.crop is used as a workaround to export the photo
 *
 * @param uri - iOS photo library URI
 * @param selectedImage - Photo identifier with dimensions
 * @returns File URI in temporary directory
 */
async function copyIosPhotoLibraryUri(
  uri: string,
  selectedImage: ExtendedPhotoIdentifier,
): Promise<string> {
  const { width = 1000, height = 1000 } = selectedImage?.node.image ?? {};

  // Use crop with full dimensions as a way to export the image
  const manipulatedPath = await PhotoManipulator.crop(uri, {
    x: 0,
    y: 0,
    width,
    height,
  });

  return manipulatedPath;
}

/**
 * Get image size asynchronously using Image.getSize
 *
 * @param uri - Image URI
 * @returns Promise with image dimensions
 *
 * @example
 * const { width, height } = await getImageSizeAsync('file:///path/to/image.jpg');
 */
export const getImageSizeAsync = (
  uri: string,
): Promise<{ width: number; height: number }> =>
  new Promise((resolve, reject) => {
    const Image = require('react-native').Image;
    Image.getSize(
      uri,
      (width: number, height: number) => resolve({ width, height }),
      (error: Error) => reject(error),
    );
  });
