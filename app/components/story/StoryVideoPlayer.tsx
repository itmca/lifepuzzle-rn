import Video, {
  OnLoadData,
  OnPlaybackRateData,
  OnProgressData,
} from 'react-native-video';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Color} from '../../constants/color.constant';
import Icon from 'react-native-vector-icons/Ionicons';
import {Bar} from 'react-native-progress';
import {toMinuteSeconds} from '../../service/time-display.service';
import {XSmallText} from '../styled/components/Text';
import {useEffect, useRef, useState} from 'react';
import {
  ContentContainer,
  HorizontalContentContainer,
} from '../styled/container/ContentContainer';
import Image from '../styled/components/Image';

type props = {
  videoUrl: string;
  setIsPaginationShown: Function;
};

const styles = StyleSheet.create({
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
});

export const VideoPlayer = ({videoUrl, setIsPaginationShown}: props) => {
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
          backgroundColor={'rgba(0, 0, 0, .3)'}
          listThumbnail={true}>
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
            position="absolute"
            gap="6px"
            bottom={2}
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
              isControlShown
                ? setIsControlShown(false)
                : setIsControlShown(true);
              isPaused && isControlShown ? setClicked(false) : null;
            }}>
            <ContentContainer
              height="100%"
              position="absolute"
              zIndex={1}
              opacity={0}
            />
          </TouchableWithoutFeedback>
        </ContentContainer>
      </ContentContainer>
      {!isClicked && (
        <ContentContainer
          listThumbnail={true}
          height="160px"
          position="absolute"
          justifyContent="center"
          alignItems="center"
          gap="5px"
          backgroundColor="rgba(0, 0, 0, .3)">
          <TouchableOpacity
            onPressIn={() => {
              if (!isClicked) {
                setClicked(true);
                setIsControlShown(true);
              }
            }}>
            <Image
              source={require('../../assets/images/play-icon.png')}
              style={{width: 40, height: 40}}
            />
          </TouchableOpacity>
          <XSmallText color={Color.WHITE} fontWeight={500}>
            {playingTime ? playingTime : ''}
          </XSmallText>
        </ContentContainer>
      )}
    </>
  );
};
