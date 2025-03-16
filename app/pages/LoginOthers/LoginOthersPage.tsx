import React, {useState} from 'react';

import GeneralLoginButton from './GeneralLoginButton';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {BasicTextInput} from '../../components/input/BasicTextInput';
import {PasswordInput} from '../../components/input/PasswordInput';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {Color} from '../../constants/color.constant';
import {
  SmallText,
  XSmallText,
} from '../../components/styled/components/LegacyText.tsx';
import {Photo} from '../../components/styled/components/Image';
import RegisterButton from '../../components/button/login/RegisterButton';

const LoginOthersPage = (): JSX.Element => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <ScreenContainer justifyContent="flex-start">
      <LoadingContainer isLoading={loading}>
        <ContentContainer
          withScreenPadding
          paddingVertical={0}
          justifyContent={'space-between'}
          flex={1}>
          <ContentContainer flex={1}>
            <ContentContainer alignCenter paddingTop={20} flex={1}>
              <Photo
                width={150}
                height={51}
                source={require('../../assets/images/puzzle-characters.png')}
              />
            </ContentContainer>
            <ContentContainer gap={24} flex={3}>
              <ContentContainer gap={12}>
                <ContentContainer gap={6}>
                  <SmallText color={Color.GREY_700}>아이디</SmallText>
                  <BasicTextInput
                    clearButton
                    text={id}
                    onChangeText={setId}
                    placeholder={'아이디를 입력해 주세요'}
                  />
                </ContentContainer>
                <ContentContainer gap={6}>
                  <SmallText color={Color.GREY_700}>비밀번호</SmallText>
                  <PasswordInput
                    password={password}
                    onChangePassword={setPassword}
                    placeholder={'8~16자, 영문+숫자+특수문자'}
                  />
                </ContentContainer>
              </ContentContainer>
              <GeneralLoginButton
                userId={id}
                password={password}
                disabled={!id || !password}
                onChangeLoading={setLoading}
              />
              <ContentContainer gap={6} useHorizontalLayout alignCenter>
                <SmallText color={Color.GREY_500}>
                  아직 회원이 아니신가요?
                </SmallText>
                <RegisterButton />
              </ContentContainer>
            </ContentContainer>
          </ContentContainer>
          <ContentContainer alignItems="center" paddingBottom={40}>
            <XSmallText color={Color.GREY_400}>
              문의: lord1229@gmail.com
            </XSmallText>
          </ContentContainer>
        </ContentContainer>
      </LoadingContainer>
    </ScreenContainer>
  );
};

export default LoginOthersPage;
