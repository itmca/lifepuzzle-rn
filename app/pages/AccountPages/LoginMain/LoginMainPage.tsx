import React, {useState} from 'react';
import LoginMainText from '../../../assets/images/login_main_text.svg';
import LoginMainIcon from '../../../assets/images/login_main_icon.svg';

import {Platform} from 'react-native';
import KaKaoSocialLoginButton from '../../../components/button/login/KaKaoSocialLoginButton.tsx';
import AppleSocialLoginButton from '../../../components/button/login/AppleSocialLoginButton.tsx';
import OtherLoginButton from '../../../components/button/login/OtherLoginButton.tsx';
import {LoadingContainer} from '../../../components/loadding/LoadingContainer.tsx';
import {ContentContainer} from '../../../components/styled/container/ContentContainer.tsx';
import {ScreenContainer} from '../../../components/styled/container/ScreenContainer.tsx';
import {BodyTextM} from '../../../components/styled/components/Text.tsx';
import {Color} from '../../../constants/color.constant.ts';

const LoginMainPage = (): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <LoadingContainer isLoading={loading}>
      <ScreenContainer gap={0}>
        <ContentContainer
          withScreenPadding
          justifyContent={'flex-end'}
          height={'100%'}
          gap={0}>
          {/* Top Part */}
          <ContentContainer
            paddingTop={40}
            expandToEnd
            gap={80}
            justifyContent={'flex-start'}>
            <ContentContainer>
              <LoginMainText />
            </ContentContainer>
            <ContentContainer alignCenter>
              <LoginMainIcon />
            </ContentContainer>
          </ContentContainer>
          {/* Login Button & Contact Part */}
          <ContentContainer
            gap={40}
            alignCenter
            showOverflow
            justifyContent={'flex-end'}>
            <ContentContainer>
              <ContentContainer gap={12} alignCenter>
                <KaKaoSocialLoginButton onChangeLoading={setLoading} />
                {Platform.OS === 'ios' && (
                  <AppleSocialLoginButton onChangeLoading={setLoading} />
                )}
                <ContentContainer paddingTop={8}>
                  <OtherLoginButton />
                </ContentContainer>
              </ContentContainer>
            </ContentContainer>
            <ContentContainer alignCenter>
              <BodyTextM color={Color.GREY_400}>
                문의: lord1229@gmail.com
              </BodyTextM>
            </ContentContainer>
          </ContentContainer>
        </ContentContainer>
      </ScreenContainer>
    </LoadingContainer>
  );
};

export default LoginMainPage;
