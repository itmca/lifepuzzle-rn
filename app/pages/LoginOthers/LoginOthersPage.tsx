import React, {useState} from 'react';

import GeneralLoginButton from './GeneralLoginButton';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {Color} from '../../constants/color.constant';
import {
  SmallText,
  XSmallText,
} from '../../components/styled/components/LegacyText.tsx';
import RegisterButton from '../../components/button/login/RegisterButton';
import BasicTextInput from '../../components/input/NewTextInput.tsx';
import LoginMainIcon from '../../assets/images/login_main_icon.svg';

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
            <ContentContainer alignCenter paddingTop={40} flex={1}>
              <LoginMainIcon width={167} />
            </ContentContainer>
            <ContentContainer gap={24} flex={3}>
              <ContentContainer gap={12}>
                <ContentContainer gap={6}>
                  <BasicTextInput
                    label={'아이디'}
                    text={id}
                    onChangeText={setId}
                    placeholder={'아이디를 입력해 주세요'}
                    validations={[
                      {
                        condition: (text: string) => !!text,
                        errorText: '아이디를 입력해 주세요',
                      },
                    ]}
                  />
                </ContentContainer>
                <ContentContainer gap={6}>
                  <BasicTextInput
                    label={'비밀번호'}
                    text={password}
                    onChangeText={setPassword}
                    placeholder={'8~16자, 영문+숫자+특수문자'}
                    secureTextEntry
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
