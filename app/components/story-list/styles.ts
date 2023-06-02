import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 0.3,
    borderBottomColor: '#979797',
    position: 'relative',
  },
  thumbnailListItemContainer: {
    flex: 1,
    flexWrap: 'nowrap',
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  textBox: {
    textAlign: 'left',
    maxWidth: '100%',
  },
  thumbnailTextBox: {
    textAlign: 'left',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    letterSpacing: 0.15,
    marginBottom: 13,
  },
  description: {
    fontSize: 12,
    opacity: 0.8,
  },
  thumbnailBox: {
    flex: 0.3,
    width: 94,
    height: 94,
  },
  thumbnailImage: {
    width: 94,
    height: 94,
    borderRadius: 10,
  },
  bottomRowBox: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  dateText: {
    fontSize: 11,
    color: '#979797',
  },
  micIconBox: {},
  profileContainer: {
    flexDirection: 'row',
    height: 90,
    width: '100%',
    alignItems: 'center',
  },
  textContainer: {
    color: '#A9A9A9',
  },
  titleTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 5,
  },
  contentTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  profileImage: {
    width: 68,
    height: 68,
    borderRadius: 50,
  },
  profileTitle: {
    fontWeight: '500',
    letterSpacing: 0.15,
    marginTop: 10,
    height: 20,
    lineHeight: 20,
  },
  profileText: {
    letterSpacing: 0.15,
    height: 20,
    lineHeight: 20,
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
});
