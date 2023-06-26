import {Button} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {SmallText} from '../styled/components/Text';
import {View} from 'react-native';
import {SmallImage} from '../styled/components/Image';
import {usePhotos} from '../../service/hooks/photo.hook';

const VideoSelectPageLink = (): JSX.Element => {
  const {openGallery} = usePhotos({
    target: 'video',
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
        width={22}
        height={14.5}
        style={{tintColor: 'gray'}}
        source={require('../../assets/images/video_call.png')}
      />
      <SmallText style={{color: 'gray'}}> 영상 추가</SmallText>
    </Button>
  );
};
export const StoryKeyboardVideoRecord = (): JSX.Element => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
      }}>
      <VideoSelectPageLink />
    </View>
  );
};
