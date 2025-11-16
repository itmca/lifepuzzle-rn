import {useAuthAxios} from '../core/auth-http.hook.ts';
import {CustomAlert} from '../../components/ui/feedback/CustomAlert';
import {useLogout} from '../auth/logout.hook.ts';

import {userState} from '../../recoils/auth/user.recoil.ts';
import {authState} from '../../recoils/auth/auth.recoil.ts';

export const useUserWithdraw = (): [() => void, boolean] => {
  const user = useRecoilValue(userState);
  const logout = useLogout();
  const tokens = useRecoilValue(authState);
  const [withdrawLoading, withdraw] = useAuthAxios<void>({
    requestOption: {
      url: `/v1/users/${String(user?.userNo)}`,
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
