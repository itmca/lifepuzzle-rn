import Video, {
  OnLoadData,
  OnPlaybackRateData,
  OnProgressData,
} from 'react-native-video';
import {
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Color} from '../../constants/color.constant';
import Icon from 'react-native-vector-icons/Ionicons';
import {Bar} from 'react-native-progress';
import {toMinuteSeconds} from '../../service/time-display.service';
import {XSmallText} from '../styled/components/Text';
import {useRef, useState} from 'react';
import {
  ContentContainer,
  HorizontalContentContainer,
} from '../styled/container/ContentContainer';

type props = {
  videoUrl: string;
  isPaused: boolean;
  isClicked: boolean;
  playingTime: string;
  setPaused: Function;
  setClicked: Function;
  setPlayingTime: Function;
};

const styles = StyleSheet.create({
  videoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  video: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: Color.BLACK,
  },
  iconContainer: {
    position: 'absolute',
    top: '35%',
    zIndex: 300,
  },
  mainButton: {
    marginRight: 15,
  },
  duration: {
    color: Color.WHITE,
    marginLeft: 15,
  },
});

export const VideoPlayer = ({
  videoUrl,
  isPaused,
  isClicked,
  playingTime,
  setPaused,
  setClicked,
  setPlayingTime,
}: props) => {
  const width = Dimensions.get('window').width - 52;
  const player = useRef<any>(null);
  const [currentProgress, setcurrentProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isControlShown, setIsControlShown] = useState<boolean>(false);

  const handlePause = (data: OnPlaybackRateData) => {
    if (data.playbackRate === 0 && isPaused == true) {
      setPaused(true);
    }
  };

  const onLoad = (data: OnLoadData) => {
    const playingTime = data.duration;
    setDuration(playingTime);
    setPlayingTime(toMinuteSeconds(playingTime));
  };

  const onProgress = (data: OnProgressData) => {
    setcurrentProgress(data.currentTime / duration);
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

  const onEnd = () => {
    setPaused(true);
  };

  return (
    <View style={styles.videoContainer}>
      <Video
        ref={player}
        style={styles.video}
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
      <ContentContainer
        width={'100%'}
        height={'100%'}
        alignItems={'center'}
        justifyContent="flex-start"
        position={'absolute'}
        opacity={isControlShown ? 100 : 0}
        backgroundColor={'#0000004f'}>
        <View style={styles.iconContainer}>
          <TouchableWithoutFeedback
            onPress={() => {
              isPaused ? setPaused(false) : setPaused(true);
            }}>
            <Icon
              name={
                isPaused
                  ? 'caret-forward-circle-outline'
                  : 'pause-circle-outline'
              }
              size={45}
              color={Color.WHITE}
            />
          </TouchableWithoutFeedback>
        </View>
        <ContentContainer
          position={'absolute'}
          gap={'6px'}
          bottom={'2px'}
          padding={9}
          zIndex={200}>
          <HorizontalContentContainer>
            <XSmallText color={Color.WHITE} style={{marginRight: 'auto'}}>
              {toMinuteSeconds(currentProgress * duration)}
            </XSmallText>
            <XSmallText color={Color.WHITE} style={{marginLeft: 'auto'}}>
              {playingTime}
            </XSmallText>
          </HorizontalContentContainer>
          <TouchableWithoutFeedback onPress={handleProgress}>
            <Bar
              progress={currentProgress}
              color={Color.PRIMARY_LIGHT}
              unfilledColor={Color.WHITE}
              borderColor={Color.GRAY}
              borderRadius={50}
              borderWidth={0}
              height={4}
              width={width}
            />
          </TouchableWithoutFeedback>
        </ContentContainer>
        <TouchableWithoutFeedback
          onPress={() => {
            isControlShown ? setIsControlShown(false) : setIsControlShown(true);
            isPaused && isControlShown ? setClicked(false) : null;
          }}>
          <View
            style={{
              backgroundColor: '#00000000',
              width: '100%',
              height: '100%',
              position: 'absolute',
              zIndex: 1,
            }}
          />
        </TouchableWithoutFeedback>
      </ContentContainer>
    </View>
  );
};
