import React from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import Image, {
  MediumImage,
  SmallImage,
  XSmallImage,
} from '../styled/components/Image';
import {usePhotos} from '../../service/hooks/photo.hook';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {
  selectedPhotoState,
  selectedVideoState,
} from '../../recoils/selected-photo.recoil';
import {Color} from '../../constants/color.constant';

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
          if (photoList.length == 0) {
            void openGallery();
          } else {
            Alert.alert(
              '이미 선택된 ' +
                (target == 'photo' ? '사진' : '영상') +
                '은 모두 초기화 됩니다.',
              '',
              [
                {
                  text: 'ok',
                  onPress: () => {
                    void openGallery();
                  },
                },
              ],
              {cancelable: false},
            );
          }
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
          <View key={photo.key}>
            <MediumImage
              key={index}
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
                setPhotoList(prev => prev.filter(e => e.key !== photo.key));
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
