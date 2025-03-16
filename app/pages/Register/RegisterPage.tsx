import React, {useCallback, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {styles} from './styles';
import ValidatedTextInput from '../../components/input/ValidatedTextInput';
import {useAxios} from '../../service/hooks/network.hook';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {PolicyAgreeSwitch} from './PolicyAgreeSwitch';
import {useNavigation} from '@react-navigation/native';
import {
  PASSWORD_REGEXP,
  PASSWORD_REGEXP_DISPLAY,
} from '../../constants/password.constant';
import {debounce} from 'lodash';
import {BasicNavigationProps} from '../../navigation/types';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {XSmallTitle} from '../../components/styled/components/Title';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../components/styled/container/ContentContainer';
import {BottomButton} from '../../components/button/BottomButton';
import {shareKeyState} from '../../recoils/share.recoil.ts';
import {useRecoilValue, useResetRecoilState} from 'recoil';

const RegisterPage = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  const shareKey = useRecoilValue(shareKeyState);
  const resetShareKey = useResetRecoilState(shareKeyState);

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

  const [registerLoading, register] = useAxios({
    requestOption: {
      url: '/v1/users',
      method: 'post',
    },
    onResponseSuccess: () => {
      resetShareKey();
      Alert.alert(
        '회원가입이 완료되었습니다.',
        '',
        [
          {
            text: '로그인하러가기',
            style: 'default',
            onPress: () => {
              navigation.push('NoTab', {
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
    onError: () => {
      // TODO: 예외 처리
    },
    disableInitialRequest: true,
  });

  const [_, idDupcheck] = useAxios<{isDuplicated: boolean}>({
    requestOption: {
      url: '/v1/users/dupcheck/id',
      method: 'get',
    },
    onResponseSuccess: ({isDuplicated}) => {
      setIdDuplicated(isDuplicated);
    },
    disableInitialRequest: true,
  });

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
  const dupcheck = useCallback(
    debounce((toCheck: string) => {
      idDupcheck({
        params: {
          id: toCheck,
        },
      });
    }, 200),
    [],
  );

  useEffect(() => {
    if (!id) {
      return;
    }
    dupcheck(id);
  }, [id]);

  return (
    <LoadingContainer isLoading={registerLoading}>
      <ScreenContainer>
        <ScrollContentContainer withScreenPadding gap={0}>
          <ContentContainer>
            <XSmallTitle style={styles.title}>닉네임</XSmallTitle>
            <ValidatedTextInput
              label=""
              value={nickname}
              onChangeText={setNickname}
              placeholder="공백 시 랜덤으로 설정"
              validations={[
                {
                  condition: nickname => nickname.length <= 8,
                  errorText: '닉네임은 8자 이하로 입력해주세요.',
                },
              ]}
              onIsErrorChanged={setNickNameError}
            />
          </ContentContainer>
          <ContentContainer>
            <XSmallTitle style={styles.title}>아이디</XSmallTitle>
            <ValidatedTextInput
              label=""
              value={id}
              onChangeText={setId}
              placeholder={''}
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
                  condition: id => !idDuplicated,
                  errorText: '이미 존재하는 아이디입니다',
                },
              ]}
              onIsErrorChanged={setIdError}
            />
          </ContentContainer>
          <ContentContainer>
            <XSmallTitle style={styles.title}>비밀번호</XSmallTitle>
            <ValidatedTextInput
              secureTextEntry={true}
              label=""
              value={password}
              onChangeText={setPassword}
              placeholder="8~16자 영문+숫자+특수문자"
              validations={[
                {
                  condition: password => password.length > 0,
                  errorText: '*8글자, 영문+숫자+특수문자',
                },
                {
                  condition: password => PASSWORD_REGEXP.test(password),
                  errorText: `${PASSWORD_REGEXP_DISPLAY}`,
                },
              ]}
              onIsErrorChanged={setPasswordError}
            />
          </ContentContainer>
          <ContentContainer>
            <XSmallTitle style={styles.title}>비밀번호 확인</XSmallTitle>
            <ValidatedTextInput
              secureTextEntry={true}
              label=""
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
              placeholder="8~16자 영문+숫자+특수문자"
              validations={[
                {
                  condition: passwordConfirm => password === passwordConfirm,
                  errorText: '비밀번호와 비밀번호 확인이 다릅니다.',
                },
              ]}
              onIsErrorChanged={setPasswordConfirmError}
            />
          </ContentContainer>
          <PolicyAgreeSwitch
            type={'service'}
            checked={isServicePolicyChecked}
            onCheckedChange={setServicePolicyChecked}
            style={{marginTop: 20}}
          />
          <PolicyAgreeSwitch
            type={'privacy'}
            checked={isPrivacyPolicyChecked}
            onCheckedChange={setPrivacyPolicyChecked}
            style={{marginTop: 15}}
          />
        </ScrollContentContainer>
        <BottomButton
          onPress={onSubmit}
          disabled={
            idError ||
            nickNameError ||
            passwordError ||
            passwordConfirmError ||
            !isServicePolicyChecked ||
            !isPrivacyPolicyChecked
          }
          title="회원가입"
        />
      </ScreenContainer>
    </LoadingContainer>
  );
};
export default RegisterPage;
