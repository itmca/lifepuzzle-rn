import React from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {Color} from '../../constants/color.constant';
import {XSmallText} from '../styled/components/Text';
import {HorizontalContentContainer} from '../styled/container/ContentContainer';
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
      <HorizontalContentContainer
        alignItems="center"
        justifyContent="center"
        width="40px"
        height="20px"
        borderRadius={3}
        backgroundColor={Color.WHITE}
        opacity={0.7}
        position="absolute"
        zIndex={100}>
        <XSmallText color={Color.FONT_DARK}>{`${
          activeMediaIndexNo + 1
        }`}</XSmallText>
        <XSmallText color={Color.DARK_GRAY}>{` / ${mediaCount}`}</XSmallText>
      </HorizontalContentContainer>
    </View>
  );
};

export default StoryMediaCarouselPagination;
