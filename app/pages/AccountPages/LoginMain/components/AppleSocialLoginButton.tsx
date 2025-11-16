import React from 'react';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {useAxios} from '../../../../service/core/auth-http.hook';
import {
  LoginResponse,
  useLoginResponseHandler,
} from '../../../../service/auth/login.hook';

import {Color} from '../../../../constants/color.constant';

import {useShareStore} from '../../../../stores/share.store';
import {BasicButton} from '../../../../components/ui/form/Button';

type Props = {
  onChangeLoading: (loading: boolean) => void;
};

const AppleSocialLoginButton = ({onChangeLoading}: Props): JSX.Element => {
  const shareKey = useShareStore(state => state.shareKey);
  const loginResponseHandler = useLoginResponseHandler();

  const [_, appleLogin] = useAxios<LoginResponse>({
    requestOption: {
      method: 'post',
      url: '/v1/auth/login/apple',
    },
    onResponseSuccess: loginResponseHandler,
    onLoadingStatusChange: onChangeLoading,
    disableInitialRequest: true,
  });

  async function onAppleButtonPress() {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      // Note: it appears putting FULL_NAME first is important, see issue #293
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      appleLogin({
        data: {
          appleUserId: appleAuthRequestResponse.user,
          email: appleAuthRequestResponse.email,
          identityToken: appleAuthRequestResponse.identityToken,
          nonce: appleAuthRequestResponse.nonce,
          shareKey,
        },
      });
    }
  }

  return (
    <BasicButton
      height={'44px'}
      iconName={'appleLogo'}
      backgroundColor={Color.BLACK}
      textColor={Color.WHITE}
      text={'Apple로 로그인'}
      onPress={() => onAppleButtonPress()}
    />
  );
};

export default AppleSocialLoginButton;
