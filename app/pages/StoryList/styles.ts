import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    backgroundColor: '#FFFFFF',
    paddingBottom: 8,
    marginTop: 24,
  },
  scrollViewContainer: {
    flex: 1,
    backgroundColor: '#e5e5e5',
  },
  floatingBtBox: {
    width: 39,
    height: 39,
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    bottom: 34,
    right: 16,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  floatingBtTop: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
  },
});
