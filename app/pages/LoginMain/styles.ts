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
  descContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    width: '90%',
    marginBottom: 40,
  },
  logo: {
    width: 48,
    height: 48,
    marginBottom: 12,
  },
  registerText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginLeft: -8,
  },
  socialContainer: {
    flex: Platform.OS === 'ios' ? 1.6 : 1.3,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '90%',
  },
  button: {
    marginBottom: 8,
  },
});
