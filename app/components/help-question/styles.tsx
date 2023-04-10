import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
    backgroundColor: '#ffffff',
  },
  bigSizeWrapper: {
    position: 'relative',
    width: '100%',
    minHeight: 73,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.15,
    elevation: 10,
    marginTop: 3,
    paddingLeft: 15,
    paddingRight: 36.15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallSizeWrapper: {
    width: 32,
    height: 32,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.15,
    elevation: 10,
    marginTop: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigSizePuzzle: {
    width: 33.94,
    height: 33.25,
  },
  smallSizePuzzle: {
    width: 24,
    height: 24,
  },
  verticalLine: {
    borderLeftWidth: 1,
    borderLeftColor: '#E5E5E5',
    height: '60%',
    marginLeft: 12,
  },
  helpQuestionText: {
    marginLeft: 24.5,
    marginRight: 36.15,
    fontWeight: 'bold',
    color: '#707070',
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.15,
  },
  closeIconWrapper: {
    height: '100%',
    position: 'absolute',
    right: 0,
  },
  closeIcon: {
    position: 'absolute',
    right: 6,
    bottom: 8,
  },
});
