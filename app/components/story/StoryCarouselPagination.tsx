import React from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import { XSmallText } from "../styled/components/Text";
type Props = {
  photoCount: number;
  activePhotoIndexNo: number;
  containerStyle?: StyleProp<ViewStyle>;
  textContainerStyle?: StyleProp<ViewStyle>;
};

const StoryCarouselPagination = ({
  photoCount,
  activePhotoIndexNo,
  containerStyle,
  textContainerStyle,
}: Props): JSX.Element => {
  return (
    <View
      style={StyleSheet.compose(
        {width: '100%', alignItems: 'center'},
        containerStyle,
      )}>
      <View
        style={StyleSheet.compose(
          {
            backgroundColor: '#979797',
            borderRadius: 16,
            paddingLeft: 8,
            paddingRight: 8,
            paddingTop: 2,
            paddingBottom: 2,
            opacity: 0.5,
          },
          textContainerStyle,
        )}>
        <XSmallText>{`${
          activePhotoIndexNo + 1
        } / ${photoCount}`}</XSmallText>
      </View>
    </View>
  );
};

export default StoryCarouselPagination;
