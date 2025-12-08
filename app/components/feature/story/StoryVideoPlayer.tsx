import Video, {
  OnLoadData,
  OnPlaybackRateChangeData,
  OnProgressData,
} from 'react-native-video';
import { Color } from '../../../constants/color.constant';
import { toMmSs } from '../../../utils/time-formatter.util.ts';
import React, { useEffect, useRef, useState } from 'react';
import { ContentContainer } from '../../ui/layout/ContentContainer';
import { VideoController } from './StoryVideoController';
import { useNavigation } from '@react-navigation/native';
import { BasicNavigationProps } from '../../../navigation/types';

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
  // Refs
  const player = useRef<any>(null);

  // React hooks
  const [duration, setDuration] = useState<number>(0);
  const [playingTime, setPlayingTime] = useState<string>('');
  const [currentProgress, setcurrentProgress] = useState<number>(0);
  const [isPaused, setPaused] = useState<boolean>(true);

  // 외부 hook 호출 (navigation, route 등)
  const navigation = useNavigation<BasicNavigationProps>();

  // Side effects
  useEffect(() => {
    setPaused(true);
    setPaginationShown(true);
  }, [activeMediaIndexNo]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      setPaused(true);
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);

  // Custom functions
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

  const handlePause = (data: OnPlaybackRateChangeData) => {
    if (data.playbackRate === 0 && isPaused == true) {
      setPaused(true);
    }
  };

  const handleProgress = (e: { nativeEvent: { pageX: number } }) => {
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
        source={{ uri: videoUrl }}
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
