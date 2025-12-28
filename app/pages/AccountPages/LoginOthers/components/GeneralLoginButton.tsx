import React, { useEffect } from 'react';
import { useHttpMutation } from '../../../../services/core/http-mutation.hook.ts';
import {
  LoginResponse,
  useLoginResponseHandler,
} from '../../../../services/auth/login.hook.ts';

import { useShareStore } from '../../../../stores/share.store';
import { BasicButton } from '../../../../components/ui/form/Button';
import { showErrorToast } from '../../../../components/ui/feedback/Toast';

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
}: Props): React.ReactElement => {
  const shareKey = useShareStore(state => state.shareKey);
  const loginResponseHandler = useLoginResponseHandler();
  const [isLoading, login] = useHttpMutation<LoginResponse>({
    axiosConfig: {
      method: 'post',
      url: '/v1/auth/login/email',
    },
    onSuccess: loginResponseHandler,
    onError: error => {
      onChangeLoading(false);
      showErrorToast('아이디와 패스워드 확인 부탁드립니다.');
    },
  });

  useEffect(() => {
    onChangeLoading(isLoading);
  }, [isLoading, onChangeLoading]);

  return (
    <BasicButton
      onPress={() => {
        login({ data: { username: userId, password, shareKey } });
      }}
      disabled={disabled}
      text={'로그인'}
    />
  );
};

export { GeneralLoginButton };
