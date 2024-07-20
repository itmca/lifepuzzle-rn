import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Color} from '../../constants/color.constant';
import {XSmallText} from '../styled/components/Text';
import {ContentContainer} from '../styled/container/ContentContainer';

type Props = {
  visible: boolean;
  mediaCount: number;
  activeMediaIndexNo: number;
  containerStyle?: StyleProp<ViewStyle>;
};

const StoryMediaCarouselPagination = ({
  visible,
  mediaCount,
  activeMediaIndexNo,
  containerStyle,
}: Props): JSX.Element => {
  if (!visible) {
    return <></>;
  }

  return (
    <View
      style={StyleSheet.compose(
        {alignItems: 'flex-end', position: 'absolute', bottom: 12, right: 12},
        containerStyle,
      )}>
      <ContentContainer
        useHorizontalLayout
        alignCenter
        gap={0}
        width="40px"
        height="20px"
        borderRadius={3}
        opacity={0.7}
        zIndex={100}>
        <XSmallText color={Color.FONT_DARK}>{`${
          activeMediaIndexNo + 1
        }`}</XSmallText>
        <XSmallText color={Color.DARK_GRAY}>{` / ${mediaCount}`}</XSmallText>
      </ContentContainer>
    </View>
  );
};

export default StoryMediaCarouselPagination;
