import {useUserHttpPayLoad} from './user.payload.hook.ts';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types.tsx';
import {useAuthAxios} from './network.hook.ts';
import {
  showErrorToast,
  showToast,
} from '../../components/styled/components/Toast.tsx';
import {CustomAlert} from '../../components/alert/CustomAlert.tsx';
import {useUpdatePublisher} from './update.hooks.ts';
import {currentUserUpdate} from '../../recoils/update.recoil.ts';
import {useRecoilValue, useResetRecoilState} from 'recoil';
import {writingUserState} from '../../recoils/user.recoil.ts';
import {HeroAuthTypeCode} from '../../constants/auth.constant.ts';

type Props = {
  onSuccess: () => void;
};

export const useUserProfileUpdate = ({
  onSuccess,
}: Props): [() => void, boolean] => {
  const navigation = useNavigation<BasicNavigationProps>();
  const publishUserUpdate = useUpdatePublisher(currentUserUpdate);
  const httpPayload = useUserHttpPayLoad();
  const resetWritingUser = useResetRecoilState(writingUserState);
  const writingUser = useRecoilValue(writingUserState);

  const [isUpdating, update] = useAuthAxios<void>({
    requestOption: {
      method: 'PUT',
      url: `/v1/users/${String(writingUser?.userNo)}`,
      headers: {'Content-Type': 'multipart/form-data'},
    },
    onResponseSuccess: () => {
      showToast('성공적으로 저장되었습니다.');
      publishUserUpdate();
      onSuccess && onSuccess();
    },
    onError: () => {
      CustomAlert.retryAlert(
        '회원 정보 수정이 실패했습니다.',
        () => update({data: httpPayload}),
        () => {
          resetWritingUser();
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        },
      );
    },
    disableInitialRequest: true,
  });

  function validate(): boolean {
    const nickname = writingUser.userNickName;
    if (!nickname) {
      CustomAlert.simpleAlert('닉네임을 입력해 주세요.');
      return false;
    }

    if (nickname.length > 8) {
      CustomAlert.simpleAlert('닉네임은 8자 이하로 입력해주세요.');
      return false;
    }

    return true;
  }

  return [
    () => {
      if (!validate()) {
        return;
      }

      update({data: httpPayload});
    },
    isUpdating,
  ];
};

type UserAuthRequestBody = {
  heroNo: number;
  userNo: number;
  heroAuthStatus: HeroAuthTypeCode;
};

export const useUserAuthUpdate = ({
  onSuccess,
}: Props): [(body: UserAuthRequestBody) => void, boolean] => {
  const [isUpdating, update] = useAuthAxios<void>({
    requestOption: {
      method: 'PUT',
      url: '/v1/heroes/auth',
      headers: {'Content-Type': 'application/json'},
    },
    onResponseSuccess: () => {
      showToast('권한 수정되었습니다.');
      onSuccess && onSuccess();
    },
    onError: () => {
      showErrorToast('권한 수정에 실패했습니다');
    },
    disableInitialRequest: true,
  });

  return [
    (body: UserAuthRequestBody) => {
      update({data: body});
    },
    isUpdating,
  ];
};
