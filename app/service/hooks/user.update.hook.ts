import {useUserHttpPayLoad} from './user.payload.hook.ts';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types.tsx';
import {useAuthAxios} from './network.hook.ts';
import {showErrorToast, showToast} from '../../components/ui/feedback/Toast';
import {useUpdatePublisher} from './update.hook.ts';
import {currentUserUpdate} from '../../recoils/shared/cache.recoil.ts';
import {useRecoilValue, useResetRecoilState} from 'recoil';
import {writingUserState} from '../../recoils/auth/user.recoil.ts';
import {HeroAuthTypeCode} from '../../constants/auth.constant.ts';
import {
  HookProps,
  UserAuthRequestBody,
} from '../../types/hooks/user-update.type';
import {useFieldValidation} from './common/validation.hook';
import {useErrorHandler} from './common/error-handler.hook';

export const useUserProfileUpdate = ({
  onSuccess,
}: HookProps): [() => void, boolean] => {
  const navigation = useNavigation<BasicNavigationProps>();
  const publishUserUpdate = useUpdatePublisher(currentUserUpdate);
  const httpPayload = useUserHttpPayLoad();
  const resetWritingUser = useResetRecoilState(writingUserState);
  const writingUser = useRecoilValue(writingUserState);

  const {validateNickname} = useFieldValidation();
  const {handleUpdateError, showSuccessToast} = useErrorHandler();

  const [isUpdating, update] = useAuthAxios<void>({
    requestOption: {
      method: 'PUT',
      url: `/v1/users/${String(writingUser?.userNo)}`,
      headers: {'Content-Type': 'multipart/form-data'},
    },
    onResponseSuccess: () => {
      showSuccessToast('성공적으로 저장되었습니다.');
      publishUserUpdate();
      onSuccess && onSuccess();
    },
    onError: () => {
      handleUpdateError(
        '회원 정보',
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
    return validateNickname(writingUser.userNickName);
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

export const useUserAuthUpdate = ({
  onSuccess,
}: HookProps): [(body: UserAuthRequestBody) => void, boolean] => {
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
