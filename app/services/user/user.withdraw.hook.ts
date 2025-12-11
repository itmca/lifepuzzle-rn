import { useAuthMutation } from '../core/auth-mutation.hook.ts';
import { CustomAlert } from '../../components/ui/feedback/CustomAlert.tsx';
import { useLogout } from '../auth/logout.hook.ts';
import { useUserStore } from '../../stores/user.store.ts';
import { useAuthStore } from '../../stores/auth.store.ts';

export const useUserWithdraw = (): [() => void, boolean] => {
  const user = useUserStore(state => state.user);
  const logout = useLogout();
  const tokens = useAuthStore(state => state.authTokens);
  const [withdrawLoading, withdraw] = useAuthMutation<void>({
    axiosConfig: {
      url: `/v1/users/${String(user?.id)}`,
      method: 'DELETE',
    },
    onSuccess: () => {
      logout();
      CustomAlert.simpleAlert('회원탈퇴가 완료되었습니다');
    },
  });

  return [
    () => {
      void withdraw({
        data: {
          socialToken: tokens.socialToken,
        },
      });
    },
    withdrawLoading,
  ];
};
