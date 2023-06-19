import React, {useState} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {CheckCover, Container} from './styles';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import Image from '../styled/components/Image';
import {useNavigation} from '@react-navigation/native';

type SelectedPhotoProps = {
  width?: number;
  height?: number;
  photoList?: PhotoIdentifier[];
};

const SelectedPhotoList = ({
  width,
  height,
  photoList,
}: SelectedPhotoProps): JSX.Element => {
  const navigation = useNavigation();
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
            source={{uri: photo.node.image.uri}}
          />
        );
      })}
      <TouchableOpacity
        onPress={() => {
          navigation.push('NoTab', {
            screen: 'PuzzleWritingNavigator',
            params: {
              screen: 'PuzzleSelectingPhoto',
            },
          });
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
