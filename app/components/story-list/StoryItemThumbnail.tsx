import React, {useState} from 'react';
import Video from 'react-native-video';
import {TouchableHighlight, TouchableOpacity, View} from 'react-native';
import {StoryType} from '../../types/story.type';
import {Photo} from '../styled/components/Image';
import {styles} from './styles';
import {ContentsOnThumbnail} from './StoryItemContentsOnThumbnail';

type props = {
  story: StoryType;
};

export const Thumbnail = ({story}: props): JSX.Element => {
  const isPhoto = story.photos.length ? true : false;
  const isAudio = story.audios.length ? true : false;

  const [isClicked, setClicked] = useState<boolean>(false);
  const [isPaused, setPaused] = useState<boolean>(true);

  //TODO
  const isVideo = false;

  return (
    <View style={styles.thumbnailContainer}>
      {isVideo ? (
        <TouchableHighlight style={styles.videoContainer}>
          <Video
            style={styles.video}
            source={{uri: ''}}
            paused={isPaused}
            resizeMode={'cover'}
            controls={true}
            muted={false}
            repeat={false}
            fullscreen={false}
          />
        </TouchableHighlight>
      ) : (
        isPhoto && (
          <Photo
            backgroundColor="#d9d9d9"
            borderTopLeftRadius={6}
            borderTopRightRadius={6}
            resizeMode="cover"
            source={{
              uri: story.photos.length > 0 ? story.photos[0] : null,
            }}
          />
        )
      )}
      {isVideo ? (
        <View style={isClicked ? {display: 'none'} : styles.dissolveView} />
      ) : (
        isAudio && (
          <View
            style={
              isPhoto
                ? styles.dissolveView
                : styles.thumbnailRecordItemContainer
            }
          />
        )
      )}
      <TouchableOpacity
        style={
          isClicked ? {display: 'none'} : styles.contentsOnThumbnailContainer
        }
        disabled={isVideo ? false : true}
        onPressIn={() => {
          if (isVideo && !isClicked) {
            setClicked(true);
            setPaused(false);
          }
        }}>
        <ContentsOnThumbnail story={story} />
      </TouchableOpacity>
    </View>
  );
};
