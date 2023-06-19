import {Button} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {SmallText} from '../styled/components/Text';
import {View} from 'react-native';

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
      <Icon name={'video-call'} size={13}></Icon>
      <SmallText> 영상 추가</SmallText>
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
