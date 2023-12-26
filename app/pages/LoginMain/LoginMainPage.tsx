import React, {useState} from 'react';

import {Platform} from 'react-native';
import KaKaoSocialLoginButton from '../../components/button/login/KaKaoSocialLoginButton';
import AppleSocialLoginButton from '../../components/button/login/AppleSocialLoginButton';
import OtherLoginButton from '../../components/button/login/OtherLoginButton';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {
  XXXLargeText,
  XSmallText,
} from '../../components/styled/components/Text';
import {Color} from '../../constants/color.constant';
import RegisterButton from '../../components/button/login/RegisterButton';
const LoginMainPage = (): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <ScreenContainer>
      <LoadingContainer isLoading={loading}>
        <ContentContainer position="absolute" top={55}>
          <ContentContainer marginBottom="21px">
            <XXXLargeText fontWeight={700} lineHeight="40px">
              기록을 공유하고 {'\n'}
              <XXXLargeText
                fontWeight={700}
                lineHeight="40px"
                color={Color.PRIMARY_LIGHT}>
                함께 할 기억
              </XXXLargeText>
              을 더해가요.
            </XXXLargeText>
          </ContentContainer>
          <KaKaoSocialLoginButton type="button" onChangeLoading={setLoading} />
          {Platform.OS === 'ios' && (
            <AppleSocialLoginButton
              type="button"
              onChangeLoading={setLoading}
            />
          )}
          <OtherLoginButton />
          <RegisterButton />
        </ContentContainer>
        <ContentContainer
          justifyContent="center"
          alignItems="center"
          position="absolute"
          bottom={40}>
          <XSmallText color="#B0B0B0">
            로그인 관련 문제가 생길 시, itmca.harmony@gmail.com으로 문의
          </XSmallText>
        </ContentContainer>
      </LoadingContainer>
    </ScreenContainer>
  );
};

export default LoginMainPage;
