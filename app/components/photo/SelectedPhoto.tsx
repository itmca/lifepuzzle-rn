import React, {useEffect, useState} from 'react';
import {MediumImage, XSmallImage} from '../styled/components/Image';
import {Color} from '../../constants/color.constant';
import {TouchableOpacity} from 'react-native';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {createThumbnail} from 'react-native-create-thumbnail';
import {
  selectedPhotoState,
  selectedVideoState,
} from '../../recoils/story-write.recoil';

type SelectedPhotoProps = {
  target?: 'photo' | 'video';
  index: number;
  size: number;
};

const SelectedPhoto = ({
  target,
  index,
  size,
}: SelectedPhotoProps): JSX.Element => {
  const photoList =
    target == 'photo'
      ? useRecoilValue(selectedPhotoState)
      : useRecoilValue(selectedVideoState);
  const setPhotoList =
    target == 'photo'
      ? useSetRecoilState(selectedPhotoState)
      : useSetRecoilState(selectedVideoState);
  const [thumbnailUri, setThumbnailUri] = useState<string>(
    photoList[index].node.image.uri,
  );

  console.log(photoList.map(photo => photo.node.image));
  const createThumbnailUrl = async () => {
    if (
      target == 'video' &&
      photoList[index].node.image.uri.startsWith('https://itmca')
    ) {
      const response = await createThumbnail({
        url: photoList[index].node.image.uri,
      });
      setThumbnailUri(response.path);
    } else {
      setThumbnailUri(photoList[index].node.image.uri);
    }
  };

  useEffect(() => {
    void createThumbnailUrl();
  }, [photoList[index].node.image.uri]);

  return (
    <TouchableOpacity activeOpacity={1}>
      <MediumImage
        style={{width: size, height: size, margin: 5, borderRadius: 4}}
        source={{uri: thumbnailUri}}
      />
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: Color.GRAY,
          width: 16,
          height: 16,
          borderRadius: 30,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          setPhotoList(prev =>
            prev.filter(
              e => e.node.image.uri !== photoList[index].node.image.uri,
            ),
          );
        }}>
        <XSmallImage
          tintColor={Color.DARK_GRAY}
          source={require('../../assets/images/close.png')}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default SelectedPhoto;
