import {GestureResponderEvent, Image, TouchableOpacity} from 'react-native';
import {ContentContainer} from '../styled/container/ContentContainer';
import {XSmallText} from '../styled/components/Text';
import {Color} from '../../constants/color.constant';

type Props = {
  mediaType: 'video' | 'audio';
  playingTime?: string;
  backgroundColor?: string;
  onPress: (event: GestureResponderEvent) => void;
};

export const MediaThumbnail = ({
  mediaType,
  backgroundColor,
  playingTime,
  onPress,
}: Props) => {
  return (
    <ContentContainer
      gap="5px"
      width="100%"
      height="100%"
      position="absolute"
      alignItems="center"
      justifyContent="center"
      backgroundColor={backgroundColor ? backgroundColor : 'rgba(0, 0, 0, 0)'}
      listThumbnail={true}>
      <TouchableOpacity onPressIn={onPress}>
        {mediaType === 'video' && (
          <Image
            source={require('../../assets/images/play-icon.png')}
            style={{width: 40, height: 40}}
          />
        )}
        {mediaType === 'audio' && (
          <Image
            source={require('../../assets/images/record-icon.png')}
            style={{width: 40, height: 40}}
          />
        )}
      </TouchableOpacity>
      <XSmallText color={Color.WHITE} fontWeight={500}>
        {playingTime ? playingTime : ''}
      </XSmallText>
    </ContentContainer>
  );
};
