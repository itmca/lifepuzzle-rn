import { useAuthAxios } from '../core/auth-http.hook.ts';
import { CustomAlert } from '../../components/ui/feedback/CustomAlert.tsx';
import { useLogout } from '../auth/logout.hook.ts';
import { useUserStore } from '../../stores/user.store.ts';
import { useAuthStore } from '../../stores/auth.store.ts';

export const useUserWithdraw = (): [() => void, boolean] => {
  const user = useUserStore(state => state.user);
  const logout = useLogout();
  const tokens = useAuthStore(state => state.authTokens);
  const [withdrawLoading, withdraw] = useAuthAxios<void>({
    requestOption: {
      url: `/v1/users/${String(user?.id)}`,
      method: 'DELETE',
    },
    onResponseSuccess: () => {
      logout();
      CustomAlert.simpleAlert('회원탈퇴가 완료되었습니다');
    },
    disableInitialRequest: true,
  });

  return [
    () => {
      withdraw({
        data: {
          socialToken: tokens.socialToken,
        },
      });
    },
    withdrawLoading,
  ];
};
