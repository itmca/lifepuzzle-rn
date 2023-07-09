import React from 'react';
import {TouchableOpacity} from 'react-native';
import Text from '../styled/components/Text';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';
import {LargeButton} from '../styled/components/Button';

export const HomeLoginButton = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();

  return (
    <LargeButton
      onPress={() => {
        navigation.push('NoTab', {
          screen: 'LoginRegisterNavigator',
          params: {
            screen: 'LoginMain',
          },
        });
      }}>
      <Text style={styles.loginText}>로그인 하러가기</Text>
    </LargeButton>
  );
};
