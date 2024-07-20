import Video, {
  OnLoadData,
  OnPlaybackRateData,
  OnProgressData,
} from 'react-native-video';
import {Color} from '../../constants/color.constant';
import {toMinuteSeconds} from '../../service/time-display.service';
import React, {useEffect, useRef, useState} from 'react';
import {ContentContainer} from '../styled/container/ContentContainer';
import {VideoController} from './StoryVideoController';
import {MediaThumbnail} from './StoryMediaThumbnail';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';

type props = {
  videoUrl: string;
  setIsPaginationShown: Function;
  isFocused?: boolean;
  listThumbnail?: boolean;
  activeMediaIndexNo?: number;
  width: number;
};

export const VideoPlayer = ({
  videoUrl,
  isFocused,
  width,
  setIsPaginationShown,
  activeMediaIndexNo,
}: props) => {
  const player = useRef<any>(null);
  const [duration, setDuration] = useState<number>(0);
  const [playingTime, setPlayingTime] = useState<string>('');
  const [currentProgress, setcurrentProgress] = useState<number>(0);
  const [isClicked, setClicked] = useState<boolean>(false);
  const [isPaused, setPaused] = useState<boolean>(true);

  useEffect(() => {
    if (!isFocused) {
      setPaused(true);
    }
  }, [isFocused]);

  useEffect(() => {
    setIsPaginationShown(!isClicked);
  }, [isClicked]);

  useEffect(() => {
    setPaused(true);
    setClicked(false);
  }, [activeMediaIndexNo]);

  const navigation = useNavigation<BasicNavigationProps>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      setPaused(true);
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);

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
  };

  return (
    <ContentContainer height="100%">
      <Video
        ref={player}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: Color.BLACK,
        }}
        source={{uri: videoUrl}}
        paused={isPaused}
        resizeMode={'contain'}
        fullscreen={false}
        controls={false}
        muted={false}
        repeat={true}
        onEnd={onEnd}
        onLoad={onLoad}
        onProgress={onProgress}
        onPlaybackRateChange={handlePause}
      />
      {isClicked ? (
        <VideoController
          width={width}
          duration={duration}
          isPaused={isPaused}
          isClicked={isClicked}
          playingTime={playingTime}
          currentProgress={currentProgress}
          handleProgress={handleProgress}
          setPaused={setPaused}
          setClicked={setClicked}
        />
      ) : (
        <MediaThumbnail
          mediaType="video"
          playingTime={playingTime}
          backgroundColor={'rgba(0, 0, 0, 0.7)'}
          onPress={() => {
            if (!isClicked) {
              setClicked(true);
            }
          }}
        />
      )}
    </ContentContainer>
  );
};
