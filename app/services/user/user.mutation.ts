import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { BasicNavigationProps } from '../../navigation/types';
import { useAuthMutation } from '../core/auth-mutation.hook';
import { showErrorToast, showToast } from '../../components/ui/feedback/Toast';
import { CustomAlert } from '../../components/ui/feedback/CustomAlert';
import { useUpdatePublisher } from '../common/cache-observer.hook';
import {
  HookProps,
  UserAuthRequestBody,
} from '../../types/hooks/user-update.type';
import { useFieldValidation } from '../auth/validation.hook';
import { useErrorHandler } from '../common/error-handler.hook';
import { useUserStore } from '../../stores/user.store';
import { useAuthStore } from '../../stores/auth.store';
import { UserPayloadService } from './user-payload.service';
import { useLogout } from '../auth/logout.hook';
import { queryKeys } from '../core/query-keys';

export type UseUpdateUserProfileReturn = {
  updateUserProfile: () => void;
  isPending: boolean;
};

export const useUpdateUserProfile = ({
  onSuccess,
}: HookProps = {}): UseUpdateUserProfileReturn => {
  const navigation = useNavigation<BasicNavigationProps>();
  const queryClient = useQueryClient();
  const publishUserUpdate = useUpdatePublisher('currentUserUpdate');
  const user = useUserStore(state => state.user);
  const writingUser = useUserStore(state => state.writingUser);
  const resetWritingUser = useUserStore(state => state.resetWritingUser);
  const httpPayload = user
    ? UserPayloadService.createUserFormData(user.id, writingUser)
    : null;

  const { validateNickname } = useFieldValidation();
  const { handleUpdateError, showSuccessToast } = useErrorHandler();

  const [isPending, trigger] = useAuthMutation<void>({
    axiosConfig: {
      method: 'PUT',
      url: `/v1/users/${String(writingUser?.id)}`,
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    onSuccess: () => {
      showSuccessToast('성공적으로 저장되었습니다.');
      publishUserUpdate();
      onSuccess && onSuccess();
      // 캐시 무효화 (유저 정보 관련 쿼리가 있다면)
      queryClient.invalidateQueries({ queryKey: queryKeys.hero.all });
    },
    onError: () => {
      handleUpdateError(
        '회원 정보',
        () => httpPayload && void trigger({ data: httpPayload }),
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

  return {
    updateUserProfile: () => {
      if (!validate()) {
        return;
      }
      httpPayload && void trigger({ data: httpPayload });
    },
    isPending,
  };
};

export type UseUpdateUserAuthReturn = {
  updateUserAuth: (body: UserAuthRequestBody) => void;
  isPending: boolean;
};

export const useUpdateUserAuth = ({
  onSuccess,
}: HookProps = {}): UseUpdateUserAuthReturn => {
  const queryClient = useQueryClient();

  const [isPending, trigger] = useAuthMutation<void>({
    axiosConfig: {
      method: 'PUT',
      url: '/v1/heroes/auth',
      headers: { 'Content-Type': 'application/json' },
    },
    onSuccess: () => {
      showToast('권한 수정되었습니다.');
      onSuccess && onSuccess();
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.hero.all });
    },
    onError: () => {
      showErrorToast('권한 수정에 실패했습니다');
    },
  });

  return {
    updateUserAuth: (body: UserAuthRequestBody) => {
      void trigger({ data: body });
    },
    isPending,
  };
};

export type UseWithdrawUserReturn = {
  withdrawUser: () => void;
  isPending: boolean;
};

export const useWithdrawUser = (): UseWithdrawUserReturn => {
  const user = useUserStore(state => state.user);
  const logout = useLogout();
  const tokens = useAuthStore(state => state.authTokens);

  const [isPending, trigger] = useAuthMutation<void>({
    axiosConfig: {
      url: `/v1/users/${String(user?.id)}`,
      method: 'DELETE',
    },
    onSuccess: () => {
      logout();
      CustomAlert.simpleAlert('회원탈퇴가 완료되었습니다');
    },
  });

  return {
    withdrawUser: () => {
      void trigger({
        data: {
          socialToken: tokens.socialToken,
        },
      });
    },
    isPending,
  };
};
