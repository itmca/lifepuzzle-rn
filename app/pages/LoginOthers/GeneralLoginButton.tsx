import React from 'react';
import {Alert, TouchableOpacity} from 'react-native';
import {useAxios} from '../../service/hooks/network.hook';
import {
  LoginResponse,
  useLoginResponseHandler,
} from '../../service/hooks/login.hook';
import {LegacyColor} from '../../constants/color.constant';
import {LargeText} from '../../components/styled/components/LegacyText.tsx';

import {useRecoilValue} from 'recoil';
import {shareKeyState} from '../../recoils/share.recoil.ts';

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
    <TouchableOpacity
      style={{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 133,
        backgroundColor: disabled
          ? LegacyColor.LIGHT_GRAY
          : LegacyColor.PRIMARY_LIGHT,
      }}
      onPress={() => {
        login({data: {username: userId, password, shareKey}});
      }}
      disabled={disabled}>
      <LargeText
        color={disabled ? '#C2C2C2' : LegacyColor.WHITE}
        fontWeight={700}>
        로그인
      </LargeText>
    </TouchableOpacity>
  );
};

export default GeneralLoginButton;
