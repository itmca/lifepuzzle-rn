import Video, {
  OnLoadData,
  OnPlaybackRateData,
  OnProgressData,
} from 'react-native-video';
import {Dimensions, StyleSheet} from 'react-native';
import {Color} from '../../constants/color.constant';
import {toMinuteSeconds} from '../../service/time-display.service';
import React, {useEffect, useRef, useState} from 'react';
import {ContentContainer} from '../styled/container/ContentContainer';
import {VideoController} from './StoryVideoController';
import {MediaThumbnail} from './StoryMediaThumbnail';

type props = {
  videoUrl: string;
  setIsPaginationShown: Function;
  listThumbnail?: boolean;
};

export const VideoPlayer = ({
  videoUrl,
  listThumbnail,
  setIsPaginationShown,
}: props) => {
  const width = Dimensions.get('window').width - 52;
  const player = useRef<any>(null);

  const [duration, setDuration] = useState<number>(0);
  const [playingTime, setPlayingTime] = useState<string>('');
  const [currentProgress, setcurrentProgress] = useState<number>(0);

  const [isClicked, setClicked] = useState<boolean>(false);
  const [isPaused, setPaused] = useState<boolean>(true);
  const [isControlShown, setIsControlShown] = useState<boolean>(false);

  useEffect(() => {
    setIsPaginationShown(!isClicked);
  }, [isClicked]);

  const onLoad = (data: OnLoadData) => {
    const videoDuration = data.duration;
    setDuration(videoDuration);
    setPlayingTime(toMinuteSeconds(videoDuration));
  };

  const onProgress = (data: OnProgressData) => {
    setcurrentProgress(data.currentTime / duration);
  };

  const onEnd = () => {
    setPaused(true);
  };

  const handlePause = (data: OnPlaybackRateData) => {
    if (data.playbackRate === 0 && isPaused == true) {
      setPaused(true);
    }
  };

  const handleProgress = (e: {nativeEvent: {pageX: number}}) => {
    const position = e.nativeEvent.pageX - 26;
    const progress = (position / width) * duration;
    player.current.seek(progress);
    onProgress({
      currentTime: progress,
      playableDuration: duration,
      seekableDuration: duration,
    });
  };

  return (
    <>
      <ContentContainer height="100%">
        <Video
          ref={player}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: Color.BLACK,
            ...{
              borderTopLeftRadius: listThumbnail ? 6 : 0,
              borderTopRightRadius: listThumbnail ? 6 : 0,
            },
          }}
          source={{uri: videoUrl}}
          paused={isPaused}
          resizeMode={'contain'}
          controls={false}
          muted={false}
          repeat={true}
          fullscreen={false}
          onEnd={onEnd}
          onLoad={onLoad}
          onPlaybackRateChange={handlePause}
          onProgress={onProgress}
        />
        {isControlShown ? (
          <VideoController
            width={width}
            listThumbnail={listThumbnail ? listThumbnail : false}
            duration={duration}
            playingTime={playingTime}
            isPaused={isPaused}
            isControlShown={isControlShown}
            currentProgress={currentProgress}
            handleProgress={handleProgress}
            setPaused={setPaused}
            setClicked={setClicked}
            setIsControlShown={setIsControlShown}
          />
        ) : (
          <MediaThumbnail
            mediaType="video"
            playingTime={playingTime}
            backgroundColor={'rgba(0, 0, 0, 0.3)'}
            onPress={() => {
              if (!isClicked) {
                setClicked(true);
                setIsControlShown(true);
              }
            }}
          />
        )}
      </ContentContainer>
    </>
  );
};
