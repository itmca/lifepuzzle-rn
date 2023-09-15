import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  carouselContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: 32,
  },
  addButtonContainer: {
    width: '80%',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginBottom: 8,
    flex: 0.2,
  },
  addButton: {
    marginTop: 16,
    backgroundColor: '#010440',
    borderRadius: 56,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonIcon: {
    color: '#ffffff',
    marginLeft: 6,
  },
  HeroCardMainContainer: {
    backgroundColor: '#010440',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
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
    marginTop: 16,
  },
  characterName: {
    color: '#F2C744',
    marginTop: 16,
  },
  characterTitle: {
    color: '#F2C744',
    marginTop: 8,
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
  mediumTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
