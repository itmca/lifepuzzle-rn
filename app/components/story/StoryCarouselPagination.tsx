import React from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';

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
        <Text style={{color: '#ffffff', fontSize: 12}}>{`${
          activePhotoIndexNo + 1
        } / ${photoCount}`}</Text>
      </View>
    </View>
  );
};

export default StoryCarouselPagination;
