import {StyleSheet} from 'react-native';
import {Color} from '../../constants/color.constant';

export const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: 32,
  },
  registerText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 2,
  },
  scrollViewContainer: {
    width: '90%',
    height: '100%',
    backgroundColor: '#ffffff',
    flex: 1,
  },
  formContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  dateInput: {
    width: '100%',
    marginBottom: 0,
  },
  title: {
    marginTop: 20,
    marginLeft: 5,
  },
  formVerificationPartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  formVerificationInput: {
    flex: 0.6,
    fontSize: 12,
    height: 40,
    marginRight: 12,
    marginBottom: 4,
  },
  formVerificationSendButton: {
    flex: 0.4,
    fontSize: 16,
    height: 40,
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
