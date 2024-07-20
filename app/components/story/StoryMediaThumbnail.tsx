import {GestureResponderEvent, Image, TouchableOpacity} from 'react-native';
import {ContentContainer} from '../styled/container/ContentContainer';
import {XSmallText} from '../styled/components/Text';
import {Color} from '../../constants/color.constant';

type Props = {
  mediaType: 'video' | 'audio';
  playingTime?: string;
  backgroundColor?: string;
  listThumbnail?: boolean;
  onPress: (event: GestureResponderEvent) => void;
};

export const MediaThumbnail = ({
  mediaType,
  playingTime,
  backgroundColor,
  onPress,
}: Props) => {
  return (
    <ContentContainer
      alignCenter
      height={'100%'}
      backgroundColor={backgroundColor ? backgroundColor : 'rgba(0, 0, 0, 0.3)'}
      absoluteTopPosition>
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
