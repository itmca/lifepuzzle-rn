import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';
import styles from './styles';
import {KakaoOAuthToken, login} from '@react-native-seoul/kakao-login';
import {useAxios} from '../../../service/hooks/network.hook';
import {
  LoginResponse,
  useLoginResponseHandler,
} from '../../../service/hooks/login.hook';
import {ImageButton, MediumButton} from '../../styled/components/Button';
import MediumText from '../../styled/components/Text';
import {Color} from '../../../constants/color.constant';

type Props = {
  onChangeLoading: (loading: boolean) => void;
  type: 'button' | 'icon';
};

const KaKaoSocialLoginButton = ({
  onChangeLoading,
  type,
}: Props): JSX.Element => {
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

  if (type === 'button') {
    return (
      <MediumButton
        onPress={signInWithKakao}
        backgroundColor="#FFE812"
        justifyContent="flex-start"
        padding="12px 9px">
        <Image
          source={require('../../../assets/images/kakao-logo.png')}
          style={styles.socialLoginIcon}
        />
        <MediumText color={Color.LIGHT_BLACK} fontWeight={600}>
          카카오톡으로 계속하기
        </MediumText>
      </MediumButton>
    );
  } else if (type === 'icon') {
    return (
      <ImageButton onPress={signInWithKakao} marginBottom="0px" width="auto">
        <Image
          source={require('../../../assets/images/login-kakao-logo.png')}
          style={styles.roundLoginButtonImage}
        />
      </ImageButton>
    );
  }
};

export default KaKaoSocialLoginButton;
