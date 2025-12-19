import React, { useMemo, useState } from 'react';
import { BasicTextInput } from '../../../../../components/ui/form/TextInput.tsx';
import { BasicButton } from '../../../../../components/ui/form/Button';
import { BottomSheet } from '../../../../../components/ui/interaction/BottomSheet';
import {
  PASSWORD_REGEXP,
  PASSWORD_REGEXP_DISPLAY,
} from '../../../../../constants/password.constant.ts';
import { useAuthMutation } from '../../../../../services/core/auth-mutation.hook.ts';
import { CustomAlert } from '../../../../../components/ui/feedback/CustomAlert';
import { useUserStore } from '../../../../../stores/user.store';
import { useLogout } from '../../../../../services/auth/logout.hook.ts';

type Props = {
  opened: boolean;
  onClose?: () => void;
};

export const PasswordUpdateBottomSheet = ({ opened, onClose }: Props) => {
  const user = useUserStore(state => state.user);
  const logout = useLogout();

  const [oldPassword, setOldPassword] = useState<string>('');
  const [oldPasswordError, setOldPasswordError] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [newPasswordError, setNewPasswordError] = useState<boolean>(false);
  const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>('');
  const [newPasswordConfirmError, setNewPasswordConfirmError] =
    useState<boolean>(false);

  const [, changePassword] = useAuthMutation<void>({
    axiosConfig: {
      url: `/v1/users/${String(user?.id)}/password`,
      method: 'PUT',
    },
    onSuccess: () => {
      logout();
      CustomAlert.simpleAlert(
        '비밀번호가 변경되었습니다. 다시 로그인 해주세요.',
      );
    },
  });

  const snapPoints = useMemo(() => ['55%'], []);

  return (
    <BottomSheet
      opened={opened}
      title={'비밀번호 변경'}
      snapPoints={snapPoints}
      onClose={() => {
        onClose && onClose();
      }}
    >
      <BasicTextInput
        label={'기존 비밀번호'}
        text={oldPassword}
        onChangeText={setOldPassword}
        secureTextEntry
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
        useInBottomSheet={true}
      />
      <BasicTextInput
        label={'새로운 비밀번호'}
        text={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
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
            errorText: '기존 비밀번호와 동일한 비밀번호로 변경할 수 없습니다.',
          },
        ]}
        onIsErrorChanged={setNewPasswordError}
        useInBottomSheet={true}
      />
      <BasicTextInput
        label={'새로운 비밀번호 확인'}
        text={newPasswordConfirm}
        onChangeText={setNewPasswordConfirm}
        secureTextEntry
        placeholder="8~16자 영문+숫자+특수문자"
        validations={[
          {
            condition: passwordConfirm => newPassword === passwordConfirm,
            errorText: '비밀번호와 비밀번호 확인이 다릅니다.',
          },
        ]}
        onIsErrorChanged={setNewPasswordConfirmError}
        useInBottomSheet={true}
      />
      <BasicButton
        text="저장하기"
        disabled={
          !oldPassword ||
          !newPassword ||
          oldPasswordError ||
          newPasswordError ||
          newPasswordConfirmError
        }
        onPress={() =>
          changePassword({
            data: {
              oldPassword,
              newPassword,
            },
          })
        }
      />
    </BottomSheet>
  );
};
