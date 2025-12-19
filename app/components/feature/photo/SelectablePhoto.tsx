import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import { PhotoIdentifier } from '@react-native-camera-roll/camera-roll';
import { AdaptiveImage } from '../../ui/base/ImageBase';
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
      <View style={{ width: size, height: size }}>
        <AdaptiveImage
          uri={imageUri}
          width={size}
          height={size}
          resizeMode="cover"
        />
        {selected ? (
          <View
            style={{
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              top: 0,
              left: 0,
              height: '100%',
              width: '100%',
              opacity: 0.5,
              backgroundColor: 'black',
              padding: 5,
            }}
          >
            {order ? (
              <PhotoIndex color={Color.WHITE}>{order}</PhotoIndex>
            ) : (
              <Icon name="checkmark" size={70} color={'white'} />
            )}
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export { SelectablePhoto };
