import {StyleSheet} from 'react-native';
import {Color} from '../../constants/color.constant';

export const styles = StyleSheet.create({
  viewBar: {
    backgroundColor: Color.GREY,
    height: 6,
    alignSelf: 'stretch',
    borderRadius: 100,
  },
  viewBarPlay: {
    backgroundColor: Color.MAIN,
    height: 6,

    alignSelf: 'stretch',
    width: 0,
    borderRadius: 100,
  },
});
