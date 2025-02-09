import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Color} from '../../constants/color.constant';
import {XXSmallText} from '../styled/components/LegacyText.tsx';
import {ContentContainer} from '../styled/container/ContentContainer';

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
        bottom: 12,
        right: 12,
      })}>
      <ContentContainer
        alignCenter
        gap={0}
        width="auto"
        paddingHorizontal={10}
        borderRadius={4}
        opacity={0.5}
        backgroundColor={Color.BLACK}
        zIndex={100}>
        <XXSmallText bold lineHeight={20} color={Color.LIGHT_GRAY}>{`${
          activeMediaIndexNo + 1
        }/${mediaCount}`}</XXSmallText>
      </ContentContainer>
    </View>
  );
};

export default MediaCarouselPagination;
