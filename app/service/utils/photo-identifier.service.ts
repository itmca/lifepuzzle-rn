import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {FacebookPhotoItem} from '../../types/external/facebook.type';
import {AgeType} from '../../types/core/media.type';

/**
 * URI 문자열을 PhotoIdentifier로 변환합니다.
 * 주로 외부 URI나 공유된 이미지를 앱 내 표준 형식으로 변환할 때 사용됩니다.
 */
export const toPhotoIdentifier = (uri: string): PhotoIdentifier => ({
  node: {
    type: '',
    subTypes: undefined,
    group_name: '',
    image: {
      filename: uri ? uri.split('/').pop() : '',
      filepath: null,
      extension: null,
      uri: uri,
      height: 0,
      width: 0,
      fileSize: null,
      playableDuration: 0,
      orientation: null,
    },
    timestamp: 0,
    modificationTimestamp: 0,
    location: null,
  },
});

/**
 * ImagePicker에서 가져온 이미지를 PhotoIdentifier로 변환합니다.
 * 카메라 촬영이나 갤러리에서 선택한 이미지를 앱 내 표준 형식으로 변환할 때 사용됩니다.
 */
export const toPhotoIdentifierFromImage = (
  image: ImageOrVideo,
): PhotoIdentifier => {
  const timestamp = Math.floor(Date.now() / 1000);
  const rawPath = image.path ?? image.sourceURL ?? '';
  const normalizedUri = rawPath.startsWith('file://')
    ? rawPath
    : `file://${rawPath}`;

  const fallbackExtension = image.mime?.split('/')?.[1] ?? 'jpg';
  const fallbackName = `camera_${timestamp}.${fallbackExtension}`;
  const filename =
    image.filename ?? normalizedUri.split('/').pop() ?? fallbackName;

  return {
    node: {
      type: 'image',
      subTypes: undefined,
      group_name: 'Camera',
      image: {
        filename,
        filepath: null,
        extension: null,
        uri: normalizedUri,
        height: image.height ?? 0,
        width: image.width ?? 0,
        fileSize:
          typeof image.size === 'number'
            ? image.size
            : image.size
              ? Number(image.size)
              : null,
        playableDuration: 0,
        orientation: null,
      },
      timestamp,
      modificationTimestamp: timestamp,
      location: null,
    },
  };
};

/**
 * Facebook 사진을 PhotoIdentifier로 변환합니다.
 * Facebook에서 가져온 사진을 앱 내 표준 형식으로 변환할 때 사용됩니다.
 */
export const toPhotoIdentifierFromFacebookPhoto = (
  facebookPhoto: FacebookPhotoItem,
  ageGroup: AgeType,
): PhotoIdentifier => {
  const timestamp = Math.floor(Date.now() / 1000);
  const filename = `facebook_${facebookPhoto.id}_${timestamp}.jpg`;

  return {
    node: {
      type: 'image',
      subTypes: undefined,
      group_name: `Facebook_${ageGroup}`,
      image: {
        filename,
        filepath: null,
        extension: null,
        uri: facebookPhoto.imageUrl,
        height: 0,
        width: 0,
        fileSize: null,
        playableDuration: 0,
        orientation: null,
      },
      timestamp,
      modificationTimestamp: timestamp,
      location: null,
    },
  };
};
