import {StyleSheet} from 'react-native';
import {Color} from '../../constants/color.constant';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  recordContainer: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderColor: Color.FONT_GRAY,
    borderWidth: 4,
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
  screenHTopContainer: {
    width: '100%',
    height: 76,
    alignItems: 'flex-start',
  },
  helpQuestionContainer: {
    paddingTop: 0,
    paddingBottom: 0,
    borderWidth: 1,
    borderColor: Color.GRAY,
    borderRadius: 4,
    backgroundColor: Color.WHITE,
  },
  viewBarWrapper: {
    marginHorizontal: 10,
    alignSelf: 'stretch',
  },
  viewBar: {
    backgroundColor: '#ccc',
    height: 4,
    alignSelf: 'stretch',
  },
  viewBarPlay: {
    backgroundColor: Color.PRIMARY_LIGHT,
    height: 4,
    width: 0,
  },
});
