import {View} from 'react-native';
import {StoryType} from '../../types/story.type';
import {styles} from './styles';
import {XSmallText} from '../styled/components/Text';
import {ContentContainer} from '../styled/container/ContentContainer';
import {Color} from '../../constants/color.constant';
import Icon from 'react-native-vector-icons/MaterialIcons';

type props = {
  story: StoryType;
  mediaType: string;
};
export const ContentsOnThumbnail = ({story, mediaType}: props): JSX.Element => {
  return (
    <>
      <ContentContainer
        height="100%"
        justifyContent="center"
        alignItems="center"
        gap="3px">
        {mediaType === 'video' && (
          <>
            <View>
              <Icon name="play-circle-filled" size={47} color={Color.WHITE} />
            </View>
            <XSmallText color={Color.WHITE} fontWeight={500}>
              {story.playingTime ? ` ${story.playingTime}` : null}
            </XSmallText>
          </>
        )}
        {mediaType === 'audio' && (
          <>
            <View style={styles.recordIconBlueContainer}>
              <Icon name="mic-none" size={26} color={'#03ACEE'} />
            </View>
            <XSmallText color={Color.WHITE} fontWeight={600}>
              {story.recordingTime ? ` ${story.recordingTime}` : null}
            </XSmallText>
          </>
        )}
      </ContentContainer>
    </>
  );
};
