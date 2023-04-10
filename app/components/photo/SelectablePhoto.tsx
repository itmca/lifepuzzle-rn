import React, {useState} from 'react';
import {Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {CheckCover, Container} from './styles';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';

type SelectablePhotoProps = {
  onSelected: Function;
  onDeselected: Function;
  size: number;
  photo: PhotoIdentifier;
  initalSelected?: boolean;
};

const SelectablePhoto = ({
  onSelected,
  onDeselected,
  size,
  photo,
  initalSelected = false,
}: SelectablePhotoProps): JSX.Element => {
  const [isSelected, setIsSelected] = useState(initalSelected);

  const _onPress = () => {
    isSelected === true ? onDeselected(photo) : onSelected(photo);
    setIsSelected(selected => !selected);
  };

  return (
    <TouchableOpacity onPress={_onPress}>
      <Container style={{width: size, height: size}}>
        <Image
          style={{width: size, height: size}}
          source={{uri: photo.node.image.uri}}
        />
        {isSelected ? (
          <CheckCover style={{height: '100%', width: '100%'}}>
            <Icon name="checkmark" size={70} color={'white'} />
          </CheckCover>
        ) : null}
      </Container>
    </TouchableOpacity>
  );
};

export default SelectablePhoto;
