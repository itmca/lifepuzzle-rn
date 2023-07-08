import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  screenTopContainer: {
    height: 160,
    backgroundColor: '#333333',
    alignItems: 'flex-start',
  },
  screenBottomContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  helpQuestionContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 5,
    marginLeft: 5,
  },
  helpQuestionText: {
    color: 'white',
  },
  titleInput: {
    position: 'absolute',
    top: -40,
    fontWeight: 'bold',
    height: 40,
    width: '100%',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  contentInput: {
    height: '100%',
  },
});
