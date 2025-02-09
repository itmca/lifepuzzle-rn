import React, {useState} from 'react';

import {Platform} from 'react-native';
import KaKaoSocialLoginButton from '../../components/button/login/KaKaoSocialLoginButton';
import AppleSocialLoginButton from '../../components/button/login/AppleSocialLoginButton';
import OtherLoginButton from '../../components/button/login/OtherLoginButton';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {
  XSmallText,
  XXXLargeText,
} from '../../components/styled/components/LegacyText.tsx';
import {LegacyColor} from '../../constants/color.constant';
import RegisterButton from '../../components/button/login/RegisterButton';

const LoginMainPage = (): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <LoadingContainer isLoading={loading}>
      <ScreenContainer gap={0}>
        <ContentContainer withScreenPadding justifyContent={'flex-end'}>
          <ContentContainer paddingHorizontal={4} gap={0}>
            <XXXLargeText fontWeight={700}>기록을 공유하고</XXXLargeText>
            <XXXLargeText fontWeight={700}>
              <XXXLargeText
                fontWeight={700}
                lineHeight={40}
                color={LegacyColor.PRIMARY_LIGHT}>
                함께 할 기억
              </XXXLargeText>
              을 더해가요
            </XXXLargeText>
          </ContentContainer>
          <ContentContainer gap={8} alignCenter>
            <KaKaoSocialLoginButton
              type="button"
              onChangeLoading={setLoading}
            />
            {Platform.OS === 'ios' && (
              <AppleSocialLoginButton
                type="button"
                onChangeLoading={setLoading}
              />
            )}
          </ContentContainer>
        </ContentContainer>
        <ContentContainer
          withScreenPadding
          paddingVertical={0}
          gap={0}
          flex={3}>
          <OtherLoginButton />
          <RegisterButton />
        </ContentContainer>
        <ContentContainer
          withScreenPadding
          justifyContent={'flex-end'}
          flex={1}>
          <XSmallText color="#B0B0B0">
            로그인 관련 문제가 생길 시, itmca.harmony@gmail.com으로 문의
          </XSmallText>
        </ContentContainer>
      </ScreenContainer>
    </LoadingContainer>
  );
};

export default LoginMainPage;
