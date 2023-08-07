import React from 'react';
import {Dimensions, ScrollView, TouchableOpacity, View} from 'react-native';
import {MediumImage, XSmallImage} from '../styled/components/Image';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {
  selectedPhotoState,
  selectedVideoState,
} from '../../recoils/selected-photo.recoil';
import {Color} from '../../constants/color.constant';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';

type SelectedPhotoProps = {
  target?: 'photo' | 'video';
  size?: number;
};
const DeviceWidth = Dimensions.get('window').width - 15;
const SelectedPhotoList = ({
  target = 'photo',
  size,
}: SelectedPhotoProps): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();

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
          navigation.push('NoTab', {
            screen: 'StoryWritingNavigator',
            params: {
              screen:
                target == 'photo'
                  ? 'StorySelectingPhoto'
                  : 'StorySelectingVideo',
            },
          });
        }}
        style={{
          width: size,
          height: size,
          margin: 5,
          borderRadius: 4,
          borderWidth: 1,
          borderColor: Color.GRAY,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            height: 16,
            width: 1,
            backgroundColor: Color.GRAY,
            alignSelf: 'center',
          }}></View>
        <View
          style={{
            position: 'absolute',
            height: 1,
            width: 16,
            backgroundColor: Color.GRAY,
            alignSelf: 'center',
            justifyContent: 'center',
          }}></View>
      </TouchableOpacity>

      {photoList?.map((photo, index) => {
        return (
          <View key={index}>
            <MediumImage
              style={{width: size, height: size, margin: 5, borderRadius: 4}}
              source={{uri: photo.node.image.uri}}
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
                  prev.filter(e => e.node.image.uri !== photo.node.image.uri),
                );
              }}>
              <XSmallImage
                tintColor={Color.DARK_GRAY}
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
