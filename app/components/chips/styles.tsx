import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
  },
  selectedChip: {
    marginRight: 16,
    height: 32,
    backgroundColor: '#010440',
  },
  selectedChipText: {
    fontSize: 16,
    color: '#ffffff',
  },
  unSelectedChip: {
    marginRight: 16,
    height: 32,
  },
  unSelectedChipText: {
    fontSize: 16,
  },
});
