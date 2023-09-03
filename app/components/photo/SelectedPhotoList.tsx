import React from 'react';
import {Dimensions, ScrollView, TouchableOpacity, View} from 'react-native';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {
  selectedPhotoState,
  selectedVideoState,
} from '../../recoils/selected-photo.recoil';
import {Color} from '../../constants/color.constant';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';
import SelectedPhoto from './SelectedPhoto';

type SelectedPhotoListProps = {
  target?: 'photo' | 'video';
  size?: number;
  upload?: boolean;
};
const DeviceWidth = Dimensions.get('window').width - 15;
const SelectedPhotoList = ({
  target = 'photo',
  size = 10,
  upload = false,
}: SelectedPhotoListProps): JSX.Element => {
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
    <View style={{height: size + 10}}>
      <ScrollView horizontal={true} style={{width: DeviceWidth}}>
        {upload && (
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
        )}

        {photoList?.map((photo, index) => {
          return (
            <SelectedPhoto
              target={target}
              index={index}
              key={index}
              size={size}></SelectedPhoto>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default SelectedPhotoList;
