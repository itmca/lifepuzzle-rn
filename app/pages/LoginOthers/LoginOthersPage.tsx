import React, {useState} from 'react';

import {Platform} from 'react-native';
import KaKaoSocialLoginButton from '../../components/button/login/KaKaoSocialLoginButton';
import AppleSocialLoginButton from '../../components/button/login/AppleSocialLoginButton';

import GeneralLoginButton from './GeneralLoginButton';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {BasicTextInput} from '../../components/input/BasicTextInput';
import {PasswordInput} from '../../components/input/PasswordInput';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {Color} from '../../constants/color.constant';
import MediumText, {
  XSmallText,
  XXXLargeText,
} from '../../components/styled/components/Text';
import {Photo} from '../../components/styled/components/Image';

const LoginOthersPage = (): JSX.Element => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <ScreenContainer justifyContent="flex-start">
      <LoadingContainer isLoading={loading}>
        <ContentContainer
          withScreenPadding
          backgroundColor={Color.PRIMARY_LIGHT}>
          <XXXLargeText color="#D2F2FF" fontWeight={700} lineHeight={40}>
            사랑하는 사람의 이야기가 {'\n'}함께 계속 될 수 있도록
          </XXXLargeText>
          <ContentContainer
            useHorizontalLayout
            withNoBackground
            justifyContent={'flex-start'}
            gap={12}>
            <MediumText color={Color.WHITE} fontWeight={600}>
              간편 로그인
            </MediumText>
            <KaKaoSocialLoginButton type="icon" onChangeLoading={setLoading} />
            {Platform.OS === 'ios' && (
              <AppleSocialLoginButton
                type="icon"
                onChangeLoading={setLoading}
              />
            )}
          </ContentContainer>
          <Photo
            width={75}
            height={40}
            source={require('../../assets/images/login-page-puzzle.png')}
            style={{position: 'absolute', bottom: 0, right: 20}}
          />
        </ContentContainer>

        <ContentContainer withScreenPadding gap={20}>
          <ContentContainer>
            <MediumText color={Color.PRIMARY_LIGHT}>아이디</MediumText>
            <BasicTextInput text={id} onChangeText={setId} />
          </ContentContainer>
          <ContentContainer>
            <MediumText color={Color.PRIMARY_LIGHT}>비밀번호</MediumText>
            <PasswordInput password={password} onChangePassword={setPassword} />
          </ContentContainer>
          <ContentContainer justifyContent="center" alignItems="center">
            <XSmallText color="#B0B0B0">
              로그인 관련 문제가 생길 시, itmca.harmony@gmail.com으로 문의
            </XSmallText>
          </ContentContainer>
        </ContentContainer>
        <GeneralLoginButton
          userId={id}
          password={password}
          disabled={!id || !password}
          onChangeLoading={setLoading}
        />
      </LoadingContainer>
    </ScreenContainer>
  );
};

export default LoginOthersPage;
