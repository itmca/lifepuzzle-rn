import {StyleSheet, Platform} from 'react-native';

export const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    width: '90%',
    marginBottom: 32,
  },
  logo: {
    width: 16,
    height: 16,
    marginBottom: 2,
    marginLeft: 1,
  },
  registerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 2,
  },
  loginTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    width: '90%',
    marginBottom: 12,
  },
  loginText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#000000',
    marginLeft: -2,
  },
  formContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '90%',
  },
  formInput: {
    width: '100%',
    marginBottom: 8,
  },
  passwordRegisterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '99%',
    marginBottom: 12,
  },
  passwordRegisterText: {
    fontSize: 12,
  },
  socialContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '90%',
    marginTop: 32,
    marginBottom: 120,
  },
});
