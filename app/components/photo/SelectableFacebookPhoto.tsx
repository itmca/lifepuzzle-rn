import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {CheckCover, Container} from './styles';
import Image from '../styled/components/Image';
import {XLargeTitle} from '../styled/components/Title';
import {Color} from '../../constants/color.constant';
import {FacebookPhotoItem} from '../../types/facebook.type';

type SelectableFacebookPhotoProps = {
  onSelected: (photo: FacebookPhotoItem) => void;
  onDeselected: (photo: FacebookPhotoItem) => void;
  size: number;
  photo: FacebookPhotoItem;
  selected?: boolean;
  order?: number;
};

const SelectableFacebookPhoto = ({
  onSelected,
  onDeselected,
  size,
  photo,
  selected = false,
  order,
}: SelectableFacebookPhotoProps): JSX.Element => {
  const _onPress = () => {
    selected === true ? onDeselected(photo) : onSelected(photo);
  };

  return (
    <TouchableOpacity onPress={_onPress}>
      <Container style={{width: size, height: size}}>
        <Image
          style={{width: size, height: size}}
          source={{uri: photo.imageUrl}}
          resizeMode="cover"
        />
        {selected ? (
          <CheckCover style={{height: '100%', width: '100%'}}>
            {order ? (
              <XLargeTitle color={Color.WHITE}>{order}</XLargeTitle>
            ) : (
              <Icon name="checkmark" size={70} color={'white'} />
            )}
          </CheckCover>
        ) : null}
      </Container>
    </TouchableOpacity>
  );
};

export default SelectableFacebookPhoto;
