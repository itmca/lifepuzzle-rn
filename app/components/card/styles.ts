import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#010440',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingButtonContainer: {
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    flex: 1,
  },
  settingButton: {
    marginRight: 16,
    marginTop: 16,
  },
  settingButtonIcon: {
    color: '#ffffff',
  },
  characterProfileContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 7,
  },
  characterNickName: {
    color: '#ffffff',
    fontSize: 24,
    marginTop: 16,
  },
  characterName: {
    color: '#F2C744',
    fontSize: 20,
    marginTop: 16,
  },
  characterTitle: {
    color: '#F2C744',
    fontSize: 20,
    marginTop: 8,
  },
  selectButtonContainer: {
    width: '100%',
    height: '13%',
    justifyContent: 'flex-end',
    flex: 1.2,
  },
  selectButton: {
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 20,
    height: '80%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eacc97',
  },
  disabledSelectButton: {
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 20,
    height: '80%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5e5e5',
  },
  selectButtonText: {
    fontSize: 16,
    color: '#010440',
  },
  disabledSelectButtonText: {
    fontSize: 16,
    color: '#010440',
  },
});
