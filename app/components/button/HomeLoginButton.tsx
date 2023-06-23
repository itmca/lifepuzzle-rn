import React from 'react';
import {TouchableOpacity} from 'react-native';
import Text from '../styled/components/Text';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';

export const HomeLoginButton = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();

  return (
    <TouchableOpacity
      style={styles.loginButton}
      onPress={() => {
        navigation.push('NoTab', {
          screen: 'LoginRegisterNavigator',
          params: {
            screen: 'LoginMain',
          },
        });
      }}>
      <Text style={styles.loginText}>로그인 하러가기</Text>
    </TouchableOpacity>
  );
};
