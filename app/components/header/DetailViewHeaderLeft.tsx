import React from 'react';
import {Pressable, StyleProp, View, ViewStyle} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {Color} from '../../constants/color.constant';
import {PostStoryKeyState} from '../../recoils/story-write.recoil';
import {useRecoilValue} from 'recoil';

type Props = {
  type?: 'cancel' | 'before';
  iconSize?: number;
  customAction?: Function;
};

const DetailViewHeaderLeft = ({
  type = 'before',
  iconSize = 26,
  customAction,
}: Props): JSX.Element => {
  const navigation = useNavigation();
  const postStoryKey = useRecoilValue(PostStoryKeyState);
  return (
    <Pressable
      onPress={() => {
        if (typeof customAction === 'function') {
          customAction();
        }
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate('HomeTab', {
            screen: 'Home',
          });
        }
      }}>
      <View style={{marginLeft: -10}}>
        <Icon
          name={type === 'cancel' ? 'x' : 'chevron-left'}
          size={iconSize}
          color={Color.FONT_GRAY}
        />
      </View>
    </Pressable>
  );
};

export default DetailViewHeaderLeft;
