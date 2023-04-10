import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import styles from './styles';
import {useAxios} from '../../../service/hooks/network.hook';
import {
  LoginResponse,
  useLoginResponseHandler,
} from '../../../service/hooks/login.hook';

type Props = {
  onChangeLoading: (loading: boolean) => void;
};

const AppleSocialLoginButton = ({onChangeLoading}: Props): JSX.Element => {
  const loginResponseHandler = useLoginResponseHandler();

  const [_, appleLogin] = useAxios<LoginResponse>({
    requestOption: {
      method: 'post',
      url: '/auth/social/apple',
    },
    onResponseSuccess: loginResponseHandler,
    onLoadingStatusChange: onChangeLoading,
    disableInitialRequest: true,
  });

  async function onAppleButtonPress() {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
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
        },
      });
    }
  }

  return (
    <TouchableOpacity
      onPress={() => onAppleButtonPress()}
      style={styles.appleLoginButtonContainer}>
      <Text style={styles.appleLogo}> </Text>
      <Text style={styles.appleLoginFont}>Apple로 계속하기</Text>
    </TouchableOpacity>
  );
};

export default AppleSocialLoginButton;
