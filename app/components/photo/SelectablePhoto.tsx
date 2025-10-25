import React from 'react';
import {Image as RNImage, Platform, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {CheckCover, Container} from './styles';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import Image from '../styled/components/Image';
import {Color} from '../../constants/color.constant';
import {PhotoIndex} from '../styled/components/Text.tsx';

type SelectablePhotoProps = {
  onSelected: Function;
  onDeselected: Function;
  size: number;
  photo: PhotoIdentifier;
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
}: SelectablePhotoProps): JSX.Element => {
  const _onPress = () => {
    selected === true ? onDeselected(photo) : onSelected(photo);
  };

  return (
    <TouchableOpacity onPress={_onPress}>
      <Container style={{width: size, height: size}}>
        {Platform.OS === 'ios' ? (
          <RNImage
            style={{width: size, height: size}}
            source={{uri: photo.node.image.uri}}
            resizeMode="cover"
          />
        ) : (
          <Image
            style={{width: size, height: size}}
            source={{uri: photo.node.image.uri}}
          />
        )}
        {selected ? (
          <CheckCover style={{height: '100%', width: '100%'}}>
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
