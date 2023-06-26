import {Avatar, Button} from 'react-native-paper';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {SmallText, XSmallText} from '../styled/components/Text';
import {View} from 'react-native';
import Image, {LargeImage, Photo, SmallImage} from '../styled/components/Image';

import {useVoiceRecorder} from '../../service/hooks/voice-record.hook';
import {usePhotos} from '../../service/hooks/photo.hook';

const PhotoSelectPageLink = (): JSX.Element => {
  const {openGallery} = usePhotos({
    target: 'photo',
  });

  return (
    <Button
      onPress={() => {
        void openGallery();
      }}
      style={{
        height: '100%',
        justifyContent: 'center',
      }}>
      <SmallImage
        width={17.5}
        height={16}
        style={{tintColor: 'gray'}}
        source={require('../../assets/images/add_a_photo.png')}
      />
      <SmallText style={{color: 'gray'}}> 사진 추가</SmallText>
    </Button>
  );
};
export const StoryKeyboardPhotoRecord = (): JSX.Element => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
      }}>
      <PhotoSelectPageLink />
    </View>
  );
};
