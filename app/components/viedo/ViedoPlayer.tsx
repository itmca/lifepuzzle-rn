import {StyleSheet, View} from 'react-native';
import Video from 'react-native-video';

type props = {
  uri: string;
  style?: object;
  paused?: boolean;
  onLoad?: void;
  repeat?: boolean;
};

const VideoPlayer = (props: props) => {
  return (
    <View style={styles.container}>
      <Video
        source={{uri: props.uri}}
        style={props.style ? props.style : styles.fullScreen}
        paused={props.paused ? props.paused : false}
        resizeMode={'cover'}
        onLoad={props.onLoad ? props.onLoad : () => {}}
        repeat={props.repeat ? props.repeat : false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 100,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default VideoPlayer;
