import React from 'react';
import Video from 'react-native-video';
import {View} from 'react-native';
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

  //TODO 하단 Flag API 반영 이후 적용
  const isVideo = false;

  return (
    <View style={styles.thumbnailContainer}>
      {isVideo ? (
        <View style={styles.videoContainer}>
          <Video
            style={styles.video}
            source={{uri: ''}}
            paused={true}
            resizeMode={'cover'}
            controls={true}
            muted={false}
            onLoad={() => {}}
            repeat={false}
            fullscreen={false}
          />
        </View>
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
        <View style={styles.dissolveView} />
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
      <ContentsOnThumbnail story={story} />
    </View>
  );
};
