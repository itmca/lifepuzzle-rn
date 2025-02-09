import React from 'react';
import {Image} from 'react-native';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import styles from './styles';
import {useAxios} from '../../../service/hooks/network.hook';
import {
  LoginResponse,
  useLoginResponseHandler,
} from '../../../service/hooks/login.hook';
import {ImageButton, MediumButton} from '../../styled/components/Button';

import {LegacyColor} from '../../../constants/color.constant';
import MediumText from '../../styled/components/LegacyText.tsx';

import {useRecoilValue} from 'recoil';
import {shareKeyState} from '../../../recoils/share.recoil.ts';

type Props = {
  onChangeLoading: (loading: boolean) => void;
  type: 'button' | 'icon';
};

const AppleSocialLoginButton = ({
  onChangeLoading,
  type = 'button',
}: Props): JSX.Element => {
  const shareKey = useRecoilValue(shareKeyState);
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
  if (type === 'button') {
    return (
      <MediumButton
        backgroundColor="#000000"
        borderRadius={16}
        onPress={() => onAppleButtonPress()}
        justifyContent="flex-start"
        padding="12px 9px">
        <Image
          source={require('../../../assets/images/apple-logo.png')}
          style={styles.appleLogo}
        />
        <MediumText color={LegacyColor.WHITE} fontWeight={600}>
          애플 아이디로 계속하기
        </MediumText>
      </MediumButton>
    );
  } else if (type === 'icon') {
    return (
      <ImageButton
        onPress={() => onAppleButtonPress()}
        marginBottom="0px"
        width="auto">
        <Image
          source={require('../../../assets/images/login-apple-logo.png')}
          style={styles.roundLoginButtonImage}
        />
      </ImageButton>
    );
  }
};

export default AppleSocialLoginButton;
