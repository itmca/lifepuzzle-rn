import {Avatar, Button} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {SmallText, XSmallText} from '../styled/components/Text';
import {View} from 'react-native';

const PhotoSelectPageLink = (): JSX.Element => {
  const navigation = useNavigation();

  return (
    <Button
      onPress={() => {
        navigation.push('NoTab', {
          screen: 'PuzzleWritingNavigator',
          params: {
            screen: 'PuzzleSelectingPhoto',
          },
        });
      }}
      style={{
        height: '100%',
        justifyContent: 'center',
      }}>
      <Icon name={'add-a-photo'} size={13}></Icon>
      <SmallText> 사진 추가</SmallText>
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
