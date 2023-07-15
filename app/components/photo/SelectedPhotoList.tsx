import React from 'react';
import {Dimensions, ScrollView, TouchableOpacity, View} from 'react-native';
import Image from '../styled/components/Image';
import {usePhotos} from '../../service/hooks/photo.hook';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {
  selectedPhotoState,
  selectedVideoState,
} from '../../recoils/selected-photo.recoil';

type SelectedPhotoProps = {
  target?: 'photo' | 'video';
  size?: number;
};
const DeviceWidth = Dimensions.get('window').width - 15;
const SelectedPhotoList = ({
  target = 'photo',
  size,
}: SelectedPhotoProps): JSX.Element => {
  const {openGallery} = usePhotos({
    target: target,
  });
  const photoList =
    target == 'photo'
      ? useRecoilValue(selectedPhotoState)
      : useRecoilValue(selectedVideoState);
  const setPhotoList =
    target == 'photo'
      ? useSetRecoilState(selectedPhotoState)
      : useSetRecoilState(selectedVideoState);
  return (
    <ScrollView horizontal={true} style={{width: DeviceWidth}}>
      <TouchableOpacity
        onPress={() => {
          void openGallery();
        }}
        style={{
          width: size,
          height: size,
          margin: 5,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#D9D9D9',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            height: 16,
            width: 1,
            backgroundColor: '#e6e6e6',
            alignSelf: 'center',
          }}></View>
        <View
          style={{
            position: 'absolute',
            height: 1,
            width: 16,
            backgroundColor: '#e6e6e6',
            alignSelf: 'center',
            justifyContent: 'center',
          }}></View>
      </TouchableOpacity>

      {photoList?.map((photo, index) => {
        return (
          <View>
            <Image
              key={index}
              style={{width: size, height: size, margin: 5, borderRadius: 8}}
              source={{uri: photo.node.image.uri}}
            />
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: '#F6F6F6',
                width: 16,
                height: 16,
                borderRadius: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                setPhotoList(prev => prev.filter(e => e.key !== photo.key));
              }}>
              <Image
                style={{width: 14, height: 14}}
                source={require('../../assets/images/close.png')}
              />
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default SelectedPhotoList;
