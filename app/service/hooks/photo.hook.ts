import {useEffect, useState} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import {useRecoilState, useSetRecoilState} from 'recoil';
import {selectedPhotoState} from '../../recoils/selected-photo.recoil';
import {usePhotoPermission} from './permission.hook';
import {MediaInfo} from '../../types/writing-story.type';

type LibraryTarget = 'photo' | 'video';
type Props = {
  target: LibraryTarget;
  initialSize?: number;
  nextSize?: number;
};

type Response = {
  openGallery: () => Promise<void>;
};
export const usePhotos = ({
  target = 'photo',
  initialSize = 20,
  nextSize = 20,
}: Props): Response => {
  const setSelectedPhotoList = useSetRecoilState(selectedPhotoState);
  useEffect(() => {
    //setSelectedPhotoList([]);
  }, []);
  usePhotoPermission();
  const openGallery = async function () {
    const result = await ImagePicker.openPicker({
      multiple: true,
      mediaType: target,
    });
    const selectedPhotoList: MediaInfo[] = [];
    result.forEach(item => {
      const uri = item.path;
      const fileName = uri?.split('/').pop();
      const file: MediaInfo = {
        mediaType: target,
        filename: fileName ?? null,
        filepath: item.path,
        extension: null,
        uri: uri,
        height: item.height,
        width: item.width,
        fileSize: item.size,
        playableDuration: 0,
        orientation: null,
      };
      selectedPhotoList.push(file);
    });
    setSelectedPhotoList(selectedPhotoList);
  };

  return {openGallery};
};
