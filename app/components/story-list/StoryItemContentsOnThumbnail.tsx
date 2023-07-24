import {View} from 'react-native';
import {StoryType} from '../../types/story.type';
import {styles} from './styles';
import Image from '../styled/components/Image';
import {getStoryDisplayDate} from '../../service/story-display.service';
import {SmallText, XSmallText} from '../styled/components/Text';
import {HorizontalContentContainer} from '../styled/container/ContentContainer';
import {Color} from '../../constants/color.constant';

type props = {
  story: StoryType;
};

export const ContentsOnThumbnail = ({story}: props): JSX.Element => {
  const isPhoto = story.photos.length ? true : false;
  const isAudio = story.audios.length ? true : false;
  const isVideo = story.videos.length ? true : false;
  const date = getStoryDisplayDate(story.date);

  return (
    <>
      <XSmallText style={styles.dateOnThumbnail} color={Color.LIGHT_GRAY}>
        {date}
      </XSmallText>
      <View style={styles.contentsOnThumbnail}>
        <View style={styles.iconsOnThumbnail}>
          <HorizontalContentContainer>
            {isVideo && (
              <>
                <View style={styles.playIconContainer}>
                  <Image
                    width={6}
                    height={8}
                    source={require('../../assets/images/playing-icon-orange.png')}
                  />
                </View>
                <XSmallText color={Color.WHITE} opacity={0.8} fontWeight={500}>
                  {story.playingTime ? ` ${story.playingTime}  ` : null}
                </XSmallText>
              </>
            )}
            {isAudio && (
              <>
                <View
                  style={
                    !isPhoto && !isVideo
                      ? styles.recordIconBlueContainer
                      : styles.recordIconGrayContainer
                  }>
                  <Image
                    width={6.67}
                    height={9}
                    source={require('../../assets/images/recording-icon-blue.png')}
                  />
                </View>
                <XSmallText
                  color={Color.WHITE}
                  opacity={0.8}
                  fontWeight={500}>{` ${story.recordingTime}`}</XSmallText>
              </>
            )}
          </HorizontalContentContainer>
        </View>
        {story.question && (
          <View style={styles.questionContainer}>
            <SmallText
              style={
                !isAudio && isPhoto && !isVideo && story.question
                  ? styles.questionTextWidthBgOnTumbnail
                  : styles.questionTextOnTumbnail
              }
              numberOfLines={1}
              ellipsizeMode="tail">
              {story.question}
            </SmallText>
          </View>
        )}
      </View>
    </>
  );
};
