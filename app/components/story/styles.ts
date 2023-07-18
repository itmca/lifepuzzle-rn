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
  uploadIconContainer: {
    width: 24,
    height: 24,
    backgroundColor: '#F6F6F6',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    width: 20,
    height: 20,
    tintColor: '#B4B3B3',
  },
  storyAudioIcon: {
    flexDirection: 'row',
    backgroundColor: '#F6F6F6',
    borderRadius: 8,
    width: 68,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
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
  },
  contentsOnThumbnail: {
    position: 'absolute',
    left: 17,
    bottom: 14,
    gap: 5,
  },
  iconsOnThumbnail: {
    flexDirection: 'row',
    gap: 3,
    marginBottom: 2,
  },
});
