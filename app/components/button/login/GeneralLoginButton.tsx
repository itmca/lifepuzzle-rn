import React from 'react';
import {Alert, Text, TouchableOpacity} from 'react-native';
import styles from './styles';
import {useAxios} from '../../../service/hooks/network.hook';
import {
  LoginResponse,
  useLoginResponseHandler,
} from '../../../service/hooks/login.hook';
import {MediumButton} from '../../styled/components/Button';

type Props = {
  userId: string;
  password: string;
  onChangeLoading: (loading: boolean) => void;
};

const GeneralLoginButton = ({
  userId,
  password,
  onChangeLoading,
}: Props): JSX.Element => {
  const loginResponseHandler = useLoginResponseHandler();
  const [_, login] = useAxios<LoginResponse>({
    requestOption: {
      method: 'post',
      url: '/auth/login',
    },
    onResponseSuccess: loginResponseHandler,
    onError: () => {
      onChangeLoading(false);
      Alert.alert('로그인 실패', '아이디와 패스워드 확인 부탁드립니다.');
    },
    onLoadingStatusChange: onChangeLoading,
    disableInitialRequest: true,
  });

  return (
    <MediumButton
      backgroundColor="#343666"
      onPress={() => {
        login({data: {username: userId, password: password}});
      }}>
      <Text style={styles.generalLoginFont}>로그인</Text>
    </MediumButton>
  );
};

export default GeneralLoginButton;
