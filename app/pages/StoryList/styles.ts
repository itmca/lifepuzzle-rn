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
    width: 48,
    height: 48,
    position: 'absolute',
    backgroundColor: '#FF6200',
    bottom: 16,
    right: 16,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderRadius: 50,
    color: '#FFFFFF',
  },
});
