import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity} from 'react-native';
import styles from './styles';
import {KakaoOAuthToken, login} from '@react-native-seoul/kakao-login';
import {useAxios} from '../../../service/hooks/network.hook';
import {
  LoginResponse,
  useLoginResponseHandler,
} from '../../../service/hooks/login.hook';

type Props = {
  onChangeLoading: (loading: boolean) => void;
};

const KaKaoSocialLoginButton = ({onChangeLoading}: Props): JSX.Element => {
  const [kakaoAccessToken, setKakaoAccessToken] = useState('');

  const signInWithKakao = async (): Promise<void> => {
    const tokens: KakaoOAuthToken = await login();
    setKakaoAccessToken(tokens.accessToken);
  };

  const loginResponseHandler = useLoginResponseHandler();

  const [_, kakaoLogin] = useAxios<LoginResponse>({
    requestOption: {
      method: 'post',
      url: '/auth/social/kakao',
      headers: {
        'kakao-access-token': kakaoAccessToken,
      },
    },
    onResponseSuccess: loginResponseHandler,
    onLoadingStatusChange: onChangeLoading,
    disableInitialRequest: true,
  });

  useEffect(() => {
    if (!kakaoAccessToken) {
      return;
    }

    kakaoLogin({
      headers: {
        'kakao-access-token': kakaoAccessToken,
      },
    });
  }, [kakaoAccessToken]);

  return (
    <TouchableOpacity
      onPress={signInWithKakao}
      style={styles.kakaoLoginButtonContainer}>
      <Image
        source={require('../../../assets/images/kakao-talk.png')}
        style={styles.socialLoginIcon}
      />
      <Text style={styles.kakaoLoginFont}>카카오로 계속하기</Text>
    </TouchableOpacity>
  );
};

export default KaKaoSocialLoginButton;
