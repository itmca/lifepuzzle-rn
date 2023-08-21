import React, {useEffect, useState} from 'react';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import {StoryType} from '../../types/story.type';
import {Photo} from '../styled/components/Image';
import {styles} from './styles';
import {ContentsOnThumbnail} from './StoryItemContentsOnThumbnail';
import {VideoPlayer} from '../story/StoryVideoPlayer';
import StoryPhotoCarousel from '../story/StoryPhotoCarousel';

type props = {
  story: StoryType;
};

export const Thumbnail = ({story}: props): JSX.Element => {
  const isPhoto = story.photos.length ? true : false;
  const isAudio = story.audios.length ? true : false;
  const isVideo = story.videos.length ? true : false;

  const [isClicked, setClicked] = useState<boolean>(false);
  const [isPaused, setPaused] = useState<boolean>(true);
  const [playingTime, setPlayingTime] = useState<string>('');

  useEffect(() => {
    story.playingTime = playingTime;
  }, [playingTime]);

  return (
    <View style={styles.thumbnailContainer}>
      {isVideo ? (
        <VideoPlayer
          videoUrl={story.videos[0]}
          isPaused={isPaused}
          isClicked={isClicked}
          playingTime={playingTime}
          setClicked={setClicked}
          setPaused={setPaused}
          setPlayingTime={setPlayingTime}
        />
      ) : isPhoto && story.photos.length == 1 ? (
        <Photo
          backgroundColor="#d9d9d9"
          borderTopLeftRadius={6}
          borderTopRightRadius={6}
          resizeMode="cover"
          source={{
            uri: story.photos.length > 0 ? story.photos[0] : null,
          }}
        />
      ) : (
        <StoryPhotoCarousel
          photos={story?.photos}
          containerStyle={{
            height: '100%',
            margin: 0,
          }}
          carouselStyle={{
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6,
          }}
          carouselWidth={Dimensions.get('window').width - 34}
        />
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
