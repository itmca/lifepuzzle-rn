import React, {useEffect, useState} from 'react';
import {MediumImage} from '../styled/components/Image';
import {Color} from '../../constants/color.constant';
import {Pressable, TouchableOpacity} from 'react-native';
import {useRecoilState} from 'recoil';
import {createThumbnail} from 'react-native-create-thumbnail';
import {writingStoryState} from '../../recoils/story-write.recoil';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
type SelectedPhotoProps = {
  target?: 'all' | 'photo' | 'video';
  index: number;
  size: number;
  cancel: boolean;
};

const SelectedPhoto = ({
  target,
  index,
  size,
  cancel = true,
}: SelectedPhotoProps): JSX.Element => {
  const [writingStory, setWritingStory] = useRecoilState(writingStoryState);
  const photoKey = target == 'video' ? 'videos' : 'photos';
  const photoList = writingStory[photoKey] || [];

  const [thumbnailUri, setThumbnailUri] = useState<string>(
    photoList[index].node.image.uri,
  );

  const createThumbnailUrl = async () => {
    if (
      target != 'photo' &&
      photoList[index].node.image.uri.startsWith('https://lifepuzzle')
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
    <TouchableOpacity>
      <MediumImage
        style={{
          width: (size / 3) * 4,
          height: size,
          margin: 5,
          borderRadius: 8,
        }}
        source={{uri: thumbnailUri}}
      />
      {cancel ? (
        <Pressable
          style={{
            position: 'absolute',
            top: 7,
            right: 8,
            backgroundColor: Color.BLACK,
            opacity: 0.5,
            width: 24,
            height: 24,
            borderRadius: 4,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            const currentList = writingStory[photoKey] || [];

            setWritingStory({
              [photoKey]: currentList.filter(
                e => e.node.image.uri !== photoList[index].node.image.uri,
              ),
            });
          }}>
          <MaterialIcons size={20} color={Color.WHITE} name={'close'} />
        </Pressable>
      ) : (
        <></>
      )}
    </TouchableOpacity>
  );
};

export default SelectedPhoto;
