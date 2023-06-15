import {Platform, StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    flexDirection: 'column',
  },
  container: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
  },
  imageContainer: {
    width: '100%',
    overflow: 'hidden',
    flex: 1.6,
    maxHeight: 355,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    borderRadius: 32,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOpacity: 0.25,
        shadowOffset: {width: 0, height: 4},
        shadowRadius: 32,
      },
    }),
  },
  descContainer: {
    width: '100%',
    paddingLeft: 9,
    paddingRight: 9,
    flex: 1,
    alignItems: 'flex-start',
  },
  titleTextContainer: {
    paddingTop: 19.75,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#171C2E',
  },
  subTextTopContainer: {
    width: '100%',
    overflow: 'hidden',
    marginTop: 12,
    alignItems: 'flex-start',
  },
  subTextBottomContainer: {
    width: '100%',
    overflow: 'hidden',
    marginTop: 8,
    alignItems: 'flex-start',
  },
  subText: {
    lineHeight: 25,
    fontSize: 13,
    letterSpacing: 0.15,
    fontWeight: '600',
    color: '#171C2E',
  },
  aniContainer: {
    width: '100%',
    flex: 0.1,
    position: 'relative',
  },
  animationText: {
    fontSize: 13,
    fontWeight: 'bold',
    lineHeight: 25,
    letterSpacing: 0.15,
    paddingBottom: 5,
  },
  fingerImage: {
    width: 24,
    height: 23,
  },
});
