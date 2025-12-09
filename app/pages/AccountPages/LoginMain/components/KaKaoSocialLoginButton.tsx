import React, { useEffect, useState } from 'react';
import { KakaoOAuthToken, login } from '@react-native-seoul/kakao-login';
import { useAxios } from '../../../../services/core/auth-http.hook';
import {
  LoginResponse,
  useLoginResponseHandler,
} from '../../../../services/auth/login.hook';
import { Color } from '../../../../constants/color.constant';

import logger from '../../../../utils/logger.util';
import { useShareStore } from '../../../../stores/share.store';
import { BasicButton } from '../../../../components/ui/form/Button';
import { showErrorToast } from '../../../../components/ui/feedback/Toast';

type Props = {
  onChangeLoading: (loading: boolean) => void;
};

const KaKaoSocialLoginButton = ({
  onChangeLoading,
}: Props): React.ReactElement => {
  const shareKey = useShareStore(state => state.shareKey);
  const [kakaoAccessToken, setKakaoAccessToken] = useState('');

  const signInWithKakao = async (): Promise<void> => {
    const tokens: KakaoOAuthToken = await login();
    setKakaoAccessToken(tokens.accessToken);
  };

  const loginResponseHandler = useLoginResponseHandler();

  const [_, kakaoLogin] = useAxios<LoginResponse>({
    requestOption: {
      method: 'post',
      url: '/v1/auth/login/kakao',
      headers: {
        'kakao-access-token': kakaoAccessToken,
      },
    },
    onResponseSuccess: loginResponseHandler,
    onError: err => {
      logger.debug('Kakao login error:', err);
      onChangeLoading(false);
      showErrorToast('카카오 로그인에 실패했습니다');
    },
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
      data: {
        shareKey,
      },
    });
  }, [kakaoAccessToken]);

  return (
    <BasicButton
      height={44}
      iconName={'kakaoLogo'}
      backgroundColor={Color.YELLOW}
      textColor={Color.BLACK}
      text={'카카오 로그인'}
      onPress={signInWithKakao}
    />
  );
};

export default KaKaoSocialLoginButton;
