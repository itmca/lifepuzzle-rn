import {Button} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {SmallText} from '../styled/components/Text';
import {View} from 'react-native';
import {SmallImage} from '../styled/components/Image';

const VideoSelectPageLink = (): JSX.Element => {
  const navigation = useNavigation();

  return (
    <Button
      onPress={() => {
        navigation.push('NoTab', {
          screen: 'PuzzleWritingNavigator',
          params: {
            screen: 'PuzzleWritingVideo',
          },
        });
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
