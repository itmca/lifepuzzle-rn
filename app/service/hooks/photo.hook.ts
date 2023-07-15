import ImagePicker from 'react-native-image-crop-picker';
import {useRecoilState} from 'recoil';
import {
  selectedPhotoState,
  selectedVideoState,
} from '../../recoils/selected-photo.recoil';
import {usePhotoPermission} from './permission.hook';
import {MediaInfo} from '../../types/writing-story.type';
import {Platform} from 'react-native';

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
  initialSize = 10,
}: Props): Response => {
  const [photoList, setPhotoList] = useRecoilState(selectedPhotoState);
  const [videoList, setVideoList] = useRecoilState(selectedVideoState);

  const addSelectedList: MediaInfo[] = [];
  const selectedList: MediaInfo[] = target == 'photo' ? photoList : videoList;
  const setSelectedList = target == 'photo' ? setPhotoList : setVideoList;

  const lastKey =
    selectedList.length > 0 ? selectedList[selectedList.length - 1].key : -1;
  usePhotoPermission();
  const openGallery = async function () {
    const result = await ImagePicker.openPicker({
      multiple: true,
      mediaType: target,
      maxFiles: initialSize,
      compressImageMaxHeight: 400,
      compressImageMaxWidth: 400,
      compressImageQuality: 0.5,
    });
    result.forEach((item, index) => {
      const uri = item.path;
      const fileName =
        Platform.OS === 'android' ? uri?.split('/').pop() : item.filename;
      const file: MediaInfo = {
        key: lastKey + 1 + index,
        node: {
          image: {
            filename: fileName ?? null,
            filepath: item.path,
            extension: null,
            uri: uri,
            height: item.height,
            width: item.width,
            fileSize: item.size,
            playableDuration: 0,
            orientation: null,
          },
        },
      };
      addSelectedList.push(file);
    });
    setSelectedList(photoList.concat(addSelectedList));
  };
  return {openGallery};
};
