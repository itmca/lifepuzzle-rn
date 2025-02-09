import {StyleSheet} from 'react-native';
import {LegacyColor} from '../../constants/color.constant';

export const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 8,
  },
  accountInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    width: '100%',
  },
  accountModificationButton: {position: 'absolute', right: 16},
  customDivider: {
    width: '100%',
    height: 8,
    backgroundColor: LegacyColor.LIGHT_GRAY,
  },
  listContainer: {
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  listItemIcon: {
    marginLeft: 8,
  },
});
