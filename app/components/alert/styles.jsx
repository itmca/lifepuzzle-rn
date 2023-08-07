import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  modalContainer: {
    width: 303,
    height: 200,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#0085FF',
    backgroundColor: '#1CA5DE',
  },
  modalCloseBtnContainer: {
    width: '100%',
    // height: '100%',
    zIndex: 1,
  },
  modalContentContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    fontWeight: '400',
    fontSize: 16,
    color: 'white',
  },
});
