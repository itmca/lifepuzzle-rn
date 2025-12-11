import { useNavigation } from '@react-navigation/native';
import { BasicNavigationProps } from '../../navigation/types.tsx';
import { useAuthMutation } from '../core/auth-mutation.hook.ts';
import {
  showErrorToast,
  showToast,
} from '../../components/ui/feedback/Toast.tsx';
import { useUpdatePublisher } from '../common/update.hook.ts';
import {
  HookProps,
  UserAuthRequestBody,
} from '../../types/hooks/user-update.type.ts';
import { useFieldValidation } from '../auth/validation.hook.ts';
import { useErrorHandler } from '../common/error-handler.hook.ts';
import { useUserStore } from '../../stores/user.store.ts';
import { UserPayloadService } from './user-payload.service.ts';

export const useUserProfileUpdate = ({
  onSuccess,
}: HookProps): [() => void, boolean] => {
  const navigation = useNavigation<BasicNavigationProps>();
  const publishUserUpdate = useUpdatePublisher('currentUserUpdate');
  const user = useUserStore(state => state.user);
  const writingUser = useUserStore(state => state.writingUser);
  const resetWritingUser = useUserStore(state => state.resetWritingUser);
  const httpPayload = user
    ? UserPayloadService.createUserFormData(user.id, writingUser)
    : null;

  const { validateNickname } = useFieldValidation();
  const { handleUpdateError, showSuccessToast } = useErrorHandler();

  const [isUpdating, update] = useAuthMutation<void>({
    axiosConfig: {
      method: 'PUT',
      url: `/v1/users/${String(writingUser?.id)}`,
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    onSuccess: () => {
      showSuccessToast('성공적으로 저장되었습니다.');
      publishUserUpdate();
      onSuccess && onSuccess();
    },
    onError: () => {
      handleUpdateError(
        '회원 정보',
        () => httpPayload && void update({ data: httpPayload }),
        () => {
          resetWritingUser();
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        },
      );
    },
  });

  function validate(): boolean {
    return validateNickname(writingUser.nickName);
  }

  return [
    () => {
      if (!validate()) {
        return;
      }

      httpPayload && void update({ data: httpPayload });
    },
    isUpdating,
  ];
};

export const useUserAuthUpdate = ({
  onSuccess,
}: HookProps): [(body: UserAuthRequestBody) => void, boolean] => {
  const [isUpdating, update] = useAuthMutation<void>({
    axiosConfig: {
      method: 'PUT',
      url: '/v1/heroes/auth',
      headers: { 'Content-Type': 'application/json' },
    },
    onSuccess: () => {
      showToast('권한 수정되었습니다.');
      onSuccess && onSuccess();
    },
    onError: () => {
      showErrorToast('권한 수정에 실패했습니다');
    },
  });

  return [
    (body: UserAuthRequestBody) => {
      void update({ data: body });
    },
    isUpdating,
  ];
};
