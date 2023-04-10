import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  carouselContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: 32,
  },
  addButtonContainer: {
    width: '80%',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginBottom: 8,
    flex: 0.2,
  },
  addButton: {
    marginTop: 16,
    backgroundColor: '#010440',
    borderRadius: 56,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonIcon: {
    color: '#ffffff',
    marginLeft: 6,
  },
});
