import {Text, View} from 'react-native';
import {StoryType} from '../../types/story.type';
import {styles} from './styles';
import Image from '../styled/components/Image';
import {getStoryDisplayDate} from '../../service/story-display.service';

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
      <Text style={styles.dateOnThumbnail}>{date}</Text>
      <View style={styles.contentsOnThumbnail}>
        <View style={styles.iconsOnThumbnail}>
          {isVideo && (
            <View style={styles.playIconContainer}>
              <Image
                width={6}
                height={8}
                source={require('../../assets/images/playing-icon.png')}
              />
            </View>
          )}
          {isAudio && (
            <View
              style={
                !isPhoto && !isVideo
                  ? styles.recordIconBlueContainer
                  : styles.recordIconGrayContainer
              }>
              <Image
                width={6.67}
                height={9}
                source={
                  isPhoto || isVideo
                    ? require('../../assets/images/recording-icon.png')
                    : require('../../assets/images/recording-icon-blue.png')
                }
              />
            </View>
          )}
        </View>
        {isAudio && (
          <Text style={styles.recordText}>음성녹음 {story.recordingTime}</Text>
        )}
        <Text
          style={
            !isAudio && isPhoto && !isVideo
              ? styles.questionTextWidthBgOnTumbnail
              : styles.questionTextOnTumbnail
          }>
          {story.playingTime ? `${story.playingTime}    ` : ''}
          {story.question ? story.question : ''}
        </Text>
      </View>
    </>
  );
};
