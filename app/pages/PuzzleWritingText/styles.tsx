import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  titleInput: {
    borderBottomWidth: 2,
    borderColor: '#dbdbdb',
    fontSize: 20,
    backgroundColor: 'white',
    paddingBottom: 8,
    height: 40,
  },
  contentInput: {
    borderWidth: 0,
    fontSize: 16,
    backgroundColor: 'white',
  },
  voiceBox: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 1,
    borderColor: '#dbdbdb',
  },
});
