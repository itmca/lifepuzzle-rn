import React from 'react';
import {Alert} from 'react-native';
import {useAxios} from '../../service/hooks/network.hook';
import {
  LoginResponse,
  useLoginResponseHandler,
} from '../../service/hooks/login.hook';

import {MediumText} from '../../components/styled/components/LegacyText.tsx';
import {Color} from '../../constants/color.constant';

import {useRecoilValue} from 'recoil';
import {shareKeyState} from '../../recoils/share.recoil.ts';
import {MediumButton} from '../../components/styled/components/Button.tsx';

type Props = {
  userId: string;
  password: string;
  disabled: boolean;
  onChangeLoading: (loading: boolean) => void;
};

const GeneralLoginButton = ({
  userId,
  password,
  disabled,
  onChangeLoading,
}: Props): JSX.Element => {
  const shareKey = useRecoilValue(shareKeyState);
  const loginResponseHandler = useLoginResponseHandler();
  const [_, login] = useAxios<LoginResponse>({
    requestOption: {
      method: 'post',
      url: '/auth/login/email',
    },
    onResponseSuccess: loginResponseHandler,
    onError: error => {
      onChangeLoading(false);
      Alert.alert('로그인 실패', '아이디와 패스워드 확인 부탁드립니다.');
    },
    onLoadingStatusChange: onChangeLoading,
    disableInitialRequest: true,
  });

  return (
    <MediumButton
      backgroundColor={Color.MAIN_DARK}
      borderRadius={6}
      onPress={() => {
        login({data: {username: userId, password, shareKey}});
      }}
      disabled={disabled}>
      <MediumText
        color={disabled ? Color.GREY_500 : Color.WHITE}
        fontWeight={700}>
        로그인
      </MediumText>
    </MediumButton>
  );
};

export default GeneralLoginButton;
