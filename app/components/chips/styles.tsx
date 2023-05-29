import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    justifyContent: 'space-between',
  },
  selectedChip: {
    height: 32,
    backgroundColor: '#010440',
  },
  selectedChipText: {
    fontSize: 16,
    color: '#ffffff',
  },
  unSelectedChip: {
    height: 32,
  },
  unSelectedChipText: {
    fontSize: 16,
  },
});
