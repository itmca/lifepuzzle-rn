import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { Color } from '../../../constants/color.constant';

import { ContentContainer } from '../layout/ContentContainer';
import { CaptionB } from '../base/TextBase';

type Props = {
  visible: boolean;
  mediaCount: number;
  activeMediaIndexNo: number;
  containerStyle?: StyleProp<ViewStyle>;
};

const MediaCarouselPagination = ({
  visible,
  mediaCount,
  activeMediaIndexNo,
  containerStyle,
}: Props): React.ReactElement => {
  if (!visible) {
    return <></>;
  }

  return (
    <View
      style={StyleSheet.compose(
        {
          alignItems: 'flex-end',
          position: 'absolute',
          top: 10,
          left: 10,
        },
        containerStyle,
      )}
    >
      <ContentContainer
        alignCenter
        gap={0}
        width="auto"
        paddingHorizontal={7}
        paddingVertical={2}
        borderRadius={4}
        opacity={0.8}
        backgroundColor={Color.GREY_700}
        zIndex={100}
      >
        <CaptionB color={Color.GREY_100}>{`${
          activeMediaIndexNo + 1
        } / ${mediaCount}`}</CaptionB>
      </ContentContainer>
    </View>
  );
};

export { MediaCarouselPagination };
