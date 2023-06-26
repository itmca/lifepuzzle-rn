import React from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import Image from '../styled/components/Image';
import {useNavigation} from '@react-navigation/native';
import {MediaInfo} from '../../types/writing-story.type';
import {usePhotos} from '../../service/hooks/photo.hook';

type SelectedPhotoProps = {
  width?: number;
  height?: number;
  photoList?: MediaInfo[];
};

const SelectedPhotoList = ({
  width,
  height,
  photoList,
}: SelectedPhotoProps): JSX.Element => {
  const {openGallery} = usePhotos({
    target: 'photo',
  });
  return (
    <ScrollView
      contentContainerStyle={{
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}>
      {photoList?.map((photo, index) => {
        return (
          <Image
            key={index}
            style={{width: width, height: height, margin: 5, borderRadius: 8}}
            source={{uri: photo.uri}}
          />
        );
      })}
      <TouchableOpacity
        onPress={() => {
          void openGallery();
        }}
        style={{
          width: width,
          height: height,
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
    </ScrollView>
  );
};

export default SelectedPhotoList;
