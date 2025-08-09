import {Platform, Image} from 'react-native';
import RNFS from 'react-native-fs';
import PhotoManipulator from 'react-native-photo-manipulator';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {SkImage, Skia} from '@shopify/react-native-skia';

export const getImageSizeAsync = (
  uri: string,
): Promise<{width: number; height: number}> =>
  new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve({width, height}),
      error => reject(error),
    );
  });

export const copyContentUriToFile = async (
  selectedImage: PhotoIdentifier,
): Promise<string> => {
  const uri = selectedImage.node.image.uri;
  if (Platform.OS === 'android' && uri.startsWith('content://')) {
    const dest = `${RNFS.TemporaryDirectoryPath}/${Date.now()}.jpg`;
    await RNFS.copyFile(uri, dest);
    return `file://${dest}`;
  }
  if (Platform.OS === 'ios' && uri.startsWith('ph://')) {
    const {width = 1000, height = 1000} = selectedImage?.node.image ?? {};
    const manipulatedPath = await PhotoManipulator.crop(uri, {
      x: 0,
      y: 0,
      width,
      height,
    });
    return manipulatedPath;
  }
  return uri;
};

export const loadSkiaImage = async (uri: string): Promise<SkImage | null> => {
  try {
    const response = await fetch(uri);
    const buffer = await response.arrayBuffer();
    const skData = Skia.Data.fromBytes(new Uint8Array(buffer));
    const skImage = Skia.Image.MakeImageFromEncoded(skData);
    return skImage ?? null;
  } catch (err) {
    console.warn('Skia image load error', err);
    return null;
  }
};

export const calculateImageDisplaySize = (
  imageWidth: number,
  imageHeight: number,
  displaySize: number,
): {width: number; height: number} => {
  const aspectRatio = imageWidth / imageHeight;
  return {
    width: displaySize,
    height: displaySize / aspectRatio,
  };
};
