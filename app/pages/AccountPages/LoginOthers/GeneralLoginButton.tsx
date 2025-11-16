import React from 'react';
import {Alert} from 'react-native';
import {useAxios} from '../../../service/core/auth-http.hook.ts';
import {
  LoginResponse,
  useLoginResponseHandler,
} from '../../../service/auth/login.hook.ts';

import {shareKeyState} from '../../../recoils/shared/share.recoil.ts';
import {BasicButton} from '../../../components/ui/form/Button';

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
      url: '/v1/auth/login/email',
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
    <BasicButton
      onPress={() => {
        login({data: {username: userId, password, shareKey}});
      }}
      disabled={disabled}
      text={'로그인'}
    />
  );
};

export default GeneralLoginButton;
