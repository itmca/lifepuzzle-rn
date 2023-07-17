import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  recordContainer: {
    width: 62,
    height: 62,
    borderRadius: 50,
    borderColor: '#010440',
    borderWidth: 1,
    margin: 10,
  },
  notIsRecordBox: {
    backgroundColor: 'red',
    width: '100%',
    height: '100%',
    borderRadius: 50,
    transform: [{scale: 0.9}],
  },
  isRecordBox: {
    backgroundColor: 'red',
    width: '100%',
    height: '100%',
    borderRadius: 12,
    transform: [{scale: 0.5}],
  },
});
