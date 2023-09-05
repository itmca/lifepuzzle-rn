import {StyleSheet} from 'react-native';
import {Color} from '../../constants/color.constant';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
  thumbnailListItemContainer: {
    display: 'flex',
    borderWidth: 1,
    borderColor: '#EBEBEB',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  itemTitle: {
    width: '95%',
    marginBottom: 11,
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    color: '#A9A9A9',
  },
  chipContainer: {
    display: 'none',
  },
  chipItem: {
    height: 26,
    borderRadius: 16,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 17,
  },
  chipText: {
    fontSize: 14,
    letterSpacing: 0.25,
  },
  questionText: {
    flex: 1,
  },
  video: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  readMoreButton: {
    backgroundColor: Color.PRIMARY_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    width: 43,
    height: 43,
    borderRadius: 50,
  },
});
