import React from 'react';
import { Image as RNImage, Platform, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CheckCover, Container } from './styles';
import { PhotoIdentifier } from '@react-native-camera-roll/camera-roll';
import Image from '../../ui/base/ImageBase';
import { Color } from '../../../constants/color.constant';
import { PhotoIndex } from '../../ui/base/TextBase';
import { FacebookPhotoItem } from '../../../types/external/facebook.type';

type SelectablePhotoProps = {
  onSelected: (photo: PhotoIdentifier | FacebookPhotoItem) => void;
  onDeselected: (photo: PhotoIdentifier | FacebookPhotoItem) => void;
  size: number;
  photo: PhotoIdentifier | FacebookPhotoItem;
  selected?: boolean;
  order?: number;
};

const SelectablePhoto = ({
  onSelected,
  onDeselected,
  size,
  photo,
  selected = false,
  order,
}: SelectablePhotoProps): React.ReactElement => {
  const _onPress = () => {
    selected === true ? onDeselected(photo) : onSelected(photo);
  };

  // Determine image URI based on photo type
  const getImageUri = (): string => {
    if ('node' in photo) {
      // PhotoIdentifier type
      return (photo as PhotoIdentifier).node.image.uri;
    } else {
      // FacebookPhotoItem type
      return (photo as FacebookPhotoItem).imageUrl;
    }
  };

  const imageUri = getImageUri();

  return (
    <TouchableOpacity onPress={_onPress}>
      <Container style={{ width: size, height: size }}>
        {Platform.OS === 'ios' && 'node' in photo ? (
          <RNImage
            style={{ width: size, height: size }}
            source={{ uri: imageUri }}
            resizeMode="cover"
          />
        ) : (
          <Image
            style={{ width: size, height: size }}
            source={{ uri: imageUri }}
            resizeMode="cover"
          />
        )}
        {selected ? (
          <CheckCover style={{ height: '100%', width: '100%' }}>
            {order ? (
              <PhotoIndex color={Color.WHITE}>{order}</PhotoIndex>
            ) : (
              <Icon name="checkmark" size={70} color={'white'} />
            )}
          </CheckCover>
        ) : null}
      </Container>
    </TouchableOpacity>
  );
};

export default SelectablePhoto;
