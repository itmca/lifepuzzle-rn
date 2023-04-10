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
  registerText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 2,
  },
  scrollViewContainer: {
    width: '90%',
  },
  formContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  formInput: {
    flex: 1,
    width: '100%',
    marginBottom: 8,
  },
  dateInput: {
    width: '100%',
    marginBottom: 0,
  },
  socialContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '90%',
    marginTop: 32,
    marginBottom: 120,
  },
});
