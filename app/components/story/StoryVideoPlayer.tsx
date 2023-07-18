import Video, {OnLoadData, OnPlaybackRateData} from 'react-native-video';
import {styles} from './styles';
import {View} from 'react-native';

type props = {
  videoUrl: string;
  isPaused: boolean;
  onLoad(data: OnLoadData): void;
  handlPause(data: OnPlaybackRateData): void;
};

export const VideoPlayer = ({
  videoUrl,
  isPaused,
  onLoad,
  handlPause,
}: props) => {
  return (
    <View style={styles.videoContainer}>
      <Video
        style={styles.video}
        source={{uri: videoUrl}}
        paused={isPaused}
        resizeMode={'cover'}
        controls={true}
        muted={false}
        repeat={false}
        onLoad={onLoad}
        fullscreen={false}
        onPlaybackRateChange={handlPause}
      />
    </View>
  );
};
