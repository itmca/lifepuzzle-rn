import {StyleSheet} from 'react-native';
import {Color} from '../../constants/color.constant';

export default StyleSheet.create({
  screenHTopContainer: {
    height: 55,
    backgroundColor: Color.DARK_GRAY,
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
  titleInput: {
    fontWeight: '700',
    height: 40,
    lineHeight: 20,
  },
});
