import RNFS, {writeFile} from 'react-native-fs';
import {encode as encodeBase64} from 'base64-arraybuffer';
import {SkImage} from '@shopify/react-native-skia';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {FilterType, FILTER_SETTINGS} from '../constants/filter.constant';

export const applyFilterToImage = (filterName: FilterType) => {
  const config = FILTER_SETTINGS[filterName];
  return config ? config.initial : 1;
};

export const saveFilteredImageToCache = async (
  canvasSnapshot: any,
  skiaImage: SkImage,
  selectedImage: PhotoIdentifier,
): Promise<PhotoIdentifier> => {
  const bytes = canvasSnapshot.encodeToBytes();
  const fileName = `filtered_${Date.now()}.png`;
  const filePath = `${RNFS.CachesDirectoryPath}/${fileName}`;

  await writeFile(filePath, encodeBase64(bytes.buffer), 'base64');

  const newImageObject = {
    ...selectedImage,
    node: {
      ...selectedImage.node,
      image: {
        ...selectedImage.node.image,
        uri: 'file://' + filePath,
        width: skiaImage.width(),
        height: skiaImage.height(),
        size: bytes.length,
        filename: fileName,
      },
    },
  };

  return newImageObject;
};
