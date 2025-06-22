import Video, {
  OnLoadData,
  OnPlaybackRateData,
  OnProgressData,
} from 'react-native-video';
import {LegacyColor} from '../../constants/color.constant';
import {toMmSs} from '../../service/date-time-display.service.ts';
import React, {useEffect, useRef, useState} from 'react';
import {ContentContainer} from '../styled/container/ContentContainer';
import {VideoController} from './StoryVideoController';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';

type props = {
  videoUrl: string;
  setPaginationShown: (data: boolean) => void;
  listThumbnail?: boolean;
  activeMediaIndexNo?: number;
  width: number;
  onLoad?: (data: OnLoadData) => void;
};

export const VideoPlayer = ({
  videoUrl,
  width,
  setPaginationShown,
  activeMediaIndexNo,
  onLoad,
}: props) => {
  const player = useRef<any>(null);
  const [duration, setDuration] = useState<number>(0);
  const [playingTime, setPlayingTime] = useState<string>('');
  const [currentProgress, setcurrentProgress] = useState<number>(0);
  const [isPaused, setPaused] = useState<boolean>(true);

  useEffect(() => {
    setPaused(true);
    setPaginationShown(true);
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

  const _onLoad = (data: OnLoadData) => {
    const videoDuration = data.duration;
    setDuration(videoDuration);
    setPlayingTime(toMmSs(videoDuration));
    onLoad && onLoad(data);
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
          backgroundColor: LegacyColor.BLACK,
        }}
        source={{uri: videoUrl}}
        paused={isPaused}
        resizeMode={'contain'}
        fullscreen={false}
        controls={false}
        muted={false}
        repeat={true}
        onEnd={onEnd}
        onLoad={_onLoad}
        onProgress={onProgress}
        onPlaybackRateChange={handlePause}
      />
      <VideoController
        width={width}
        duration={duration}
        isPaused={isPaused}
        playingTime={playingTime}
        currentProgress={currentProgress}
        handleProgress={handleProgress}
        setPaused={setPaused}
        onVisibleChanged={setPaginationShown}
      />
    </ContentContainer>
  );
};
