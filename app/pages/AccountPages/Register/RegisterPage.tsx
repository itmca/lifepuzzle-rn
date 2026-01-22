import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { logger } from '../../../utils/logger.util';
import { PolicyAgreeSwitch } from './components/PolicyAgreeSwitch';
import { useNavigation } from '@react-navigation/native';
import { showErrorToast } from '../../../components/ui/feedback/Toast';
import {
  PASSWORD_REGEXP,
  PASSWORD_REGEXP_DISPLAY,
} from '../../../constants/password.constant';
import { BasicNavigationProps } from '../../../navigation/types';
import { PageContainer } from '../../../components/ui/layout/PageContainer';
import { ScrollContainer } from '../../../components/ui/layout/ScrollContainer';
import { ContentContainer } from '../../../components/ui/layout/ContentContainer.tsx';
import { useShareStore } from '../../../stores/share.store';

import { BasicTextInput } from '../../../components/ui/form/TextInput.tsx';
import { BasicButton } from '../../../components/ui/form/Button';
import { Color } from '../../../constants/color.constant.ts';
import { Divider } from '../../../components/ui/base/Divider';
import { useHttpMutation } from '../../../services/core/http-mutation.hook.ts';
import { useHttpQuery } from '../../../services/core/http-query.hook.ts';

const RegisterPage = (): React.ReactElement => {
  // React hooks
  const [id, setId] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');

  const [idDuplicated, setIdDuplicated] = useState<boolean>(false);
  const [idError, setIdError] = useState<boolean>(true);
  const [nickNameError, setNickNameError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(true);
  const [passwordConfirmError, setPasswordConfirmError] =
    useState<boolean>(true);

  const [isServicePolicyChecked, setServicePolicyChecked] =
    useState<boolean>(false);
  const [isPrivacyPolicyChecked, setPrivacyPolicyChecked] =
    useState<boolean>(false);

  // 글로벌 상태 관리
  const { shareKey, resetShare } = useShareStore();

  // 외부 hook 호출 (navigation, route 등)
  const navigation = useNavigation<BasicNavigationProps>();

  // Custom hooks
  const [registerLoading, register] = useHttpMutation({
    axiosConfig: {
      url: '/v1/users',
      method: 'post',
    },
    onSuccess: () => {
      resetShare();
      Alert.alert(
        '회원가입이 완료되었습니다.',
        '',
        [
          {
            text: '로그인하러가기',
            style: 'default',
            onPress: () => {
              navigation.navigate('Auth', {
                screen: 'LoginRegisterNavigator',
                params: {
                  screen: 'LoginOthers',
                },
              });
            },
          },
        ],
        {
          cancelable: false,
        },
      );
    },
    onError: err => {
      logger.debug('Register error:', err);
      showErrorToast('회원가입에 실패했습니다.');
    },
  });

  // ID 중복 체크 Query
  const { data: dupcheckData, isError: isDupcheckError } = useHttpQuery<{
    isDuplicated: boolean;
  }>({
    queryKey: ['users', 'dupcheck', id],
    axiosConfig: {
      url: '/v1/users/dupcheck/id',
      method: 'get',
      params: { id },
    },
    enabled: !!id && id.length >= 3, // ID가 있고 3자 이상일 때만 실행
    staleTime: 0, // 항상 최신 데이터 체크
    retry: 1, // 실패 시 1번만 재시도
    onSuccess: data => {
      logger.debug('[ID Dupcheck] API Response:', {
        id,
        isDuplicated: data.isDuplicated,
        response: data,
      });
    },
    onError: error => {
      logger.debug('[ID Dupcheck] API Error:', {
        id,
        error: error.message,
        status: error.response?.status,
      });
    },
  });

  // Custom functions
  const onSubmit = () => {
    if (idError || nickNameError || passwordError || passwordConfirmError) {
      return;
    }

    if (!isServicePolicyChecked) {
      showErrorToast('서비스 이용 약관에 동의하여 주세요.');
      return;
    } else if (!isPrivacyPolicyChecked) {
      showErrorToast('개인정보 처리 방침에 동의하여 주세요.');
      return;
    }

    register({
      data: {
        id,
        nickName: nickname,
        password,
        shareKey,
      },
    });
  };

  // Side effects
  // ID 중복 체크 결과 처리
  useEffect(() => {
    if (dupcheckData) {
      logger.debug('[ID Dupcheck] Processing result:', {
        currentId: id,
        isDuplicated: dupcheckData.isDuplicated,
        willShowToast: dupcheckData.isDuplicated,
      });

      if (dupcheckData.isDuplicated) {
        showErrorToast('이미 존재하는 아이디입니다.');
      }
      setIdDuplicated(dupcheckData.isDuplicated);
    }
  }, [dupcheckData, id]);

  // ID 중복 체크 에러 처리
  useEffect(() => {
    if (isDupcheckError) {
      logger.debug('ID dupcheck error');
      showErrorToast('아이디 중복 확인에 실패했습니다.');
    }
  }, [isDupcheckError]);

  return (
    <PageContainer
      edges={['left', 'right', 'bottom']}
      isLoading={registerLoading}
    >
      <ScrollContainer keyboardAware>
        <ContentContainer withScreenPadding>
          <ContentContainer>
            <BasicTextInput
              label={'아이디'}
              text={id}
              onChangeText={setId}
              placeholder={'아이디를 입력해주세요'}
              validations={[
                {
                  condition: id => id.length > 0,
                  errorText: '아이디를 입력해주세요.',
                },
                {
                  condition: id => id?.length >= 3 && id?.length <= 30,
                  errorText: '3자 이상 31자 미만으로 입력해주세요.',
                },
                {
                  condition: () => !idDuplicated,
                  errorText: '이미 존재하는 아이디입니다',
                },
              ]}
              onIsErrorChanged={setIdError}
            />
            <BasicTextInput
              label={'비밀번호'}
              text={password}
              onChangeText={setPassword}
              placeholder="8~16자 영문+숫자+특수문자"
              secureTextEntry
              validations={[
                {
                  condition: password => password.length > 0,
                  errorText: '8글자, 영문+숫자+특수문자를 입력해주세요.',
                },
                {
                  condition: password => PASSWORD_REGEXP.test(password),
                  errorText: `${PASSWORD_REGEXP_DISPLAY}`,
                },
              ]}
              onIsErrorChanged={setPasswordError}
            />
            <BasicTextInput
              label={'비밀번호 확인'}
              text={passwordConfirm}
              onChangeText={setPasswordConfirm}
              placeholder="8~16자 영문+숫자+특수문자"
              secureTextEntry
              validations={[
                {
                  condition: passwordConfirm => password === passwordConfirm,
                  errorText: '비밀번호와 비밀번호 확인이 다릅니다.',
                },
              ]}
              onIsErrorChanged={setPasswordConfirmError}
            />
            <BasicTextInput
              label={'닉네임(선택)'}
              text={nickname}
              onChangeText={setNickname}
              placeholder="미입력 시 랜덤으로 설정"
              validations={[
                {
                  condition: nickname => !nickname || nickname.length <= 8,
                  errorText: '닉네임은 8자 이하로 입력해주세요.',
                },
              ]}
              onIsErrorChanged={setNickNameError}
            />
          </ContentContainer>
          <Divider color={Color.GREY} marginVertical={4} />
          <ContentContainer gap={4}>
            <PolicyAgreeSwitch
              type={'service'}
              checked={isServicePolicyChecked}
              onCheckedChange={setServicePolicyChecked}
            />
            <PolicyAgreeSwitch
              type={'privacy'}
              checked={isPrivacyPolicyChecked}
              onCheckedChange={setPrivacyPolicyChecked}
            />
          </ContentContainer>
          <ContentContainer paddingTop={8}>
            <BasicButton
              onPress={onSubmit}
              disabled={
                idError ||
                nickNameError ||
                passwordError ||
                passwordConfirmError ||
                !isServicePolicyChecked ||
                !isPrivacyPolicyChecked
              }
              text="회원가입"
            />
          </ContentContainer>
        </ContentContainer>
      </ScrollContainer>
    </PageContainer>
  );
};
export { RegisterPage };
