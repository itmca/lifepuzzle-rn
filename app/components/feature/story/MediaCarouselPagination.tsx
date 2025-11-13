import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

import {Color} from '../../../constants/color.constant';

import {ContentContainer} from '../../ui/layout/ContentContainer';
import {Caption} from '../../ui/base/TextBase';

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
}: Props): JSX.Element => {
  if (!visible) {
    return <></>;
  }

  return (
    <View
      style={StyleSheet.compose({
        alignItems: 'flex-end',
        position: 'absolute',
        top: 10,
        left: 10,
      })}>
      <ContentContainer
        alignCenter
        gap={0}
        width="auto"
        paddingHorizontal={8}
        borderRadius={4}
        opacity={0.5}
        backgroundColor={Color.BLACK}
        zIndex={100}>
        <Caption fontSize={10} color={Color.GREY}>{`${
          activeMediaIndexNo + 1
        } / ${mediaCount}`}</Caption>
      </ContentContainer>
    </View>
  );
};

export default MediaCarouselPagination;
