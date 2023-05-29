import React, {useState} from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import {useRecoilValue} from 'recoil';
import {userState} from '../../recoils/user.recoil';
import {useAuthAxios} from '../../service/hooks/network.hook';
import CtaButton from '../../components/button/CtaButton';
import {useNavigation} from '@react-navigation/native';
import ValidatedTextInput from '../../components/input/ValidatedTextInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  PASSWORD_REGEXP,
  PASSWORD_REGEXP_DISPLAY,
} from '../../constants/password.constant';

const AccountPasswordModificationPage = (): JSX.Element => {
  const user = useRecoilValue(userState);
  const navigation = useNavigation();
  const [oldPassword, setOldPassword] = useState<string>('');
  const [oldPasswordError, setOldPasswordError] = useState<boolean>(true);
  const [newPassword, setNewPassword] = useState<string>('');
  const [newPasswordError, setNewPasswordError] = useState<boolean>(true);
  const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>('');
  const [newPasswordConfirmError, setNewPasswordConfirmError] =
    useState<boolean>(true);
  const [_, changePassword] = useAuthAxios<void>({
    requestOption: {
      url: `/users/${String(user?.userNo)}/password`,
      method: 'PUT',
    },
    onResponseSuccess: () => {
      navigation.goBack();
    },
    disableInitialRequest: true,
  });

  return (
    <View style={styles.mainContainer}>
      <KeyboardAwareScrollView
        style={styles.scrollViewContainer}
        contentContainerStyle={styles.formContainer}>
        <ValidatedTextInput
          secureTextEntry={true}
          label="기존 비밀번호"
          value={oldPassword}
          onChangeText={setOldPassword}
          placeholder="8~16자 영문+숫자+특수문자"
          validations={[
            {
              condition: password => password.length > 0,
              errorText: '비밀번호를 입력 해 주세요.',
            },
            {
              condition: password => PASSWORD_REGEXP.test(password),
              errorText: `${PASSWORD_REGEXP_DISPLAY} 입력이 필요합니다.`,
            },
          ]}
          onIsErrorChanged={setOldPasswordError}
        />
        <ValidatedTextInput
          secureTextEntry={true}
          label="새로운 비밀번호"
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="8~16자 영문+숫자+특수문자"
          validations={[
            {
              condition: password => password.length > 0,
              errorText: '비밀번호를 입력 해 주세요.',
            },
            {
              condition: password => PASSWORD_REGEXP.test(password),
              errorText: `${PASSWORD_REGEXP_DISPLAY} 입력이 필요합니다.`,
            },
            {
              condition: password => password !== oldPassword,
              errorText:
                '기존 비밀번호와 동일한 비밀번호로 변경할 수 없습니다.',
            },
          ]}
          onIsErrorChanged={setNewPasswordError}
        />
        <ValidatedTextInput
          secureTextEntry={true}
          label="새로운 비밀번호 확인"
          value={newPasswordConfirm}
          onChangeText={setNewPasswordConfirm}
          placeholder="8~16자 영문+숫자+특수문자"
          validations={[
            {
              condition: newPasswordConfirm =>
                newPassword === newPasswordConfirm,
              errorText: '비밀번호와 비밀번호 확인이 다릅니다.',
            },
          ]}
          onIsErrorChanged={setNewPasswordConfirmError}
        />
        <CtaButton
          text="비밀번호 변경"
          disabled={
            oldPasswordError || newPasswordError || newPasswordConfirmError
          }
          onPress={() => {
            changePassword({
              data: {
                oldPassword,
                newPassword,
              },
            });
          }}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};
export default AccountPasswordModificationPage;
