import React, { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import logger from '../../../utils/logger.util';
import { PolicyAgreeSwitch } from './components/PolicyAgreeSwitch';
import { useNavigation } from '@react-navigation/native';
import {
  PASSWORD_REGEXP,
  PASSWORD_REGEXP_DISPLAY,
} from '../../../constants/password.constant';
import { debounce } from '../../../utils/debounce.util';
import { BasicNavigationProps } from '../../../navigation/types';
import { PageContainer } from '../../../components/ui/layout/PageContainer';
import { ScrollContainer } from '../../../components/ui/layout/ScrollContainer';
import { ContentContainer } from '../../../components/ui/layout/ContentContainer.tsx';
import { useShareStore } from '../../../stores/share.store';

import BasicTextInput from '../../../components/ui/form/TextInput.tsx';
import { BasicButton } from '../../../components/ui/form/Button';
import { Color } from '../../../constants/color.constant.ts';
import { Divider } from '../../../components/ui/base/Divider';
import { useAxios } from '../../../services/core/auth-http.hook.ts';

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
  const [registerLoading, register] = useAxios({
    requestOption: {
      url: '/v1/users',
      method: 'post',
    },
    onResponseSuccess: () => {
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
      Alert.alert('회원가입에 실패했습니다.');
    },
    disableInitialRequest: true,
  });

  const [_, idDupcheck] = useAxios<{ isDuplicated: boolean }>({
    requestOption: {
      url: '/v1/users/dupcheck/id',
      method: 'get',
    },
    onResponseSuccess: ({ isDuplicated }) => {
      if (isDuplicated) {
        Alert.alert('이미 존재하는 아이디입니다.');
      }
      setIdDuplicated(isDuplicated);
    },
    onError: err => {
      logger.debug('ID dupcheck error:', err);
      Alert.alert('아이디 중복 확인에 실패했습니다.');
    },
    disableInitialRequest: true,
  });

  // Memoized 값
  const dupcheck = useCallback(
    debounce((toCheck: string) => {
      idDupcheck({
        params: {
          id: toCheck,
        },
      });
    }, 200),
    [idDupcheck],
  );

  // Custom functions
  const onSubmit = () => {
    if (idError || nickNameError || passwordError || passwordConfirmError) {
      return;
    }

    if (!isServicePolicyChecked) {
      Alert.alert('서비스 이용 약관에 동의하여 주세요.');
      return;
    } else if (!isPrivacyPolicyChecked) {
      Alert.alert('개인정보 처리 방침에 동의하여 주세요.');
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
  useEffect(() => {
    if (!id) {
      return;
    }
    dupcheck(id);
  }, [id, dupcheck]);

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
export default RegisterPage;
