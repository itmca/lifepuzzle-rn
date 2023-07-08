import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  photo: {
    height: '100%',
    width: '100%',
  },
  storyAudioContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyKeyBox: {
    borderWidth: 1,
    borderColor: '#DBD6D6',
    verticalAlign: 'middle',
    height: 56,
    flexDirection: 'row',
  },
  verticalLine: {
    height: '50%',
    width: 1,
    backgroundColor: '#E6E6E6',
    alignSelf: 'center',
  },
  storyAudioIcon: {
    flexDirection: 'row',
    backgroundColor: '#F6F6F6',
    borderRadius: 8,
    width: 68,
    height: 27,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});
