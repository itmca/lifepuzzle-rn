import {StyleSheet} from 'react-native';
import {Color} from '../../constants/color.constant';

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

  viewBarWrapper: {
    marginHorizontal: 10,
    alignSelf: 'stretch',
  },
  viewBar: {
    backgroundColor: '#ccc',
    height: 4,
    alignSelf: 'stretch',
  },
  viewBarPlay: {
    backgroundColor: Color.PRIMARY_LIGHT,
    height: 4,
    width: 0,
  },
});
