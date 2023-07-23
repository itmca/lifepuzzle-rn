import {StyleSheet} from 'react-native';
import {Color} from '../../constants/color.constant';

export default StyleSheet.create({
  screenHTopContainer: {
    height: 90,
    backgroundColor: Color.DARK_GRAY,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderBottomWidth: 5,
  },
  screenLTopContainer: {
    backgroundColor: Color.DARK_GRAY,
    borderTopWidth: 0,
  },
  dateInput: {
    position: 'absolute',
    top: 0,
  },
  screenCenterContainer: {
    height: 50,
  },
  screenBottomContainer: {
    flex: 1,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  helpQuestionContainer: {
    paddingTop: 0,
    paddingBottom: 0,
    borderWidth: 1,
    borderColor: Color.GRAY,
    borderRadius: 4,
    backgroundColor: Color.WHITE,
  },
  titleInput: {
    fontWeight: 'bold',
    height: 40,
    lineHeight: 20,
  },
});
