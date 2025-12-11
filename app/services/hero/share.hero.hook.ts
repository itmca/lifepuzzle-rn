import { useAuthMutation } from '../core/auth-mutation.hook.ts';
import { CustomAlert } from '../../components/ui/feedback/CustomAlert.tsx';
import { useEffect } from 'react';
import { useAuthStore } from '../../stores/auth.store.ts';
import { useShareStore } from '../../stores/share.store.ts';

type Params = {
  shareKey?: string;
  onRegisterSuccess?: () => void;
};

export const useRegisterSharedHero = ({
  shareKey,
  onRegisterSuccess,
}: Params) => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn());
  const setShareKey = useShareStore(state => state.setShareKey);

  const [, registerHero] = useAuthMutation<any>({
    axiosConfig: {
      url: '/v1/heroes/auth',
      method: 'post',
    },
    onSuccess: res => {
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    },
    onError: error => {
      if (error.response?.status === 409) {
        CustomAlert.simpleAlert('이미 등록되어 있는 주인공입니다');
      } else if (error.response?.status === 410) {
        CustomAlert.simpleAlert('기간 만료된 링크입니다');
      } else {
        CustomAlert.actionAlert({
          title: '오류가 발생했습니다.',
          desc: '잠시 후 다시 시도하거나 새로 접속해주세요',
          actionBtnText: '재시도',
          action: () => {
            void registerHero({
              params: {
                shareKey,
              },
            });
          },
        });
      }
    },
  });

  useEffect(() => {
    if (!shareKey) {
      return;
    }

    if (!isLoggedIn) {
      CustomAlert.actionAlert({
        title: '주인공을 공유 받았습니다.',
        desc: '로그인/회원가입 시 해당 주인공을 연결하시겠습니까?',
        actionBtnText: '연결하기',
        action: () => {
          setShareKey(shareKey);
        },
      });
    } else if (shareKey) {
      void registerHero({
        params: {
          shareKey,
        },
      });
    }
  }, [isLoggedIn, registerHero, setShareKey, shareKey]);
};
