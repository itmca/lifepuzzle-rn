import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../../navigation/types';
import {MediumButton} from '../../styled/components/Button';

const OtherLoginButton = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  return (
    <MediumButton
      backgroundColor="#F4F4F4"
      onPress={() => {
        navigation.push('NoTab', {
          screen: 'LoginRegisterNavigator',
          params: {
            screen: 'LoginOthers',
          },
        });
      }}>
      <Text style={styles.kakaoLoginFont}>다른 방법으로 로그인하기</Text>
    </MediumButton>
  );
};

export default OtherLoginButton;
