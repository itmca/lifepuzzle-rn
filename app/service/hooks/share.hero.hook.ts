import {useAuthAxios} from './network.hook.ts';
import {CustomAlert} from '../../components/alert/CustomAlert.tsx';
import {useEffect} from 'react';
import {AxiosError} from 'axios';
import {useRecoilValue} from 'recoil';
import {isLoggedInState} from '../../recoils/auth.recoil.ts';

type Params = {
  shareKey?: string;
  onRegisterSuccess?: () => void;
  onError?: (error: AxiosError) => void;
};

export const useRegisterSharedHero = ({shareKey}: Params) => {
  const isLoggedIn = useRecoilValue<boolean>(isLoggedInState);

  const [_, registerHero] = useAuthAxios<any>({
    requestOption: {
      url: '/heroes/auth',
      method: 'post',
    },
    onResponseSuccess: () => {},
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
            registerHero({
              params: {
                shareKey,
              },
            });
          },
        });
      }
    },
    disableInitialRequest: true,
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
          // TODO(border-line): LocalStorage 연결
        },
      });
    } else {
      if (shareKey) {
        registerHero({
          params: {
            shareKey,
          },
        });
      }
    }
  }, [shareKey]);
};
