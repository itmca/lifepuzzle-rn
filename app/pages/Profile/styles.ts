import {StyleSheet} from 'react-native';

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
  accountAvatar: {
    marginLeft: 20,
  },
  accountNickName: {marginLeft: 24, fontSize: 24},
  accountModificationButton: {position: 'absolute', right: 16},
  customDivider: {
    height: 8,
    backgroundColor: '#E9E9E9',
  },
  listContainer: {
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  listItemIcon: {
    marginLeft: 8,
  },
});
