import { useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthMutation } from '../core/auth-mutation.hook';
import { useUpdatePublisher } from '../common/cache-observer.hook';
import { BasicNavigationProps } from '../../navigation/types';
import { useHeroStore } from '../../stores/hero.store';
import { useUIStore } from '../../stores/ui.store';
import { useAuthStore } from '../../stores/auth.store';
import { useShareStore } from '../../stores/share.store';
import { CustomAlert } from '../../components/ui/feedback/CustomAlert';
import { showToast, showErrorToast } from '../../components/ui/feedback/Toast';
import { HeroPayloadService } from './hero-payload.service';
import { queryKeys } from '../core/query-keys';
import { logger } from '../../utils/logger.util';
import { useHeroFormValidation } from './hero-validation.hook';
import { HeroesQueryResponse } from './hero.query';
export type UseCreateHeroReturn = {
  createHero: () => void;
  isPending: boolean;
};

export type UseCreateHeroOptions = {
  onSuccessNavigation?: () => void;
};

export const useCreateHero = (
  options?: UseCreateHeroOptions,
): UseCreateHeroReturn => {
  const navigation = useNavigation<BasicNavigationProps>();
  const queryClient = useQueryClient();
  const publishHeroUpdate = useUpdatePublisher('heroUpdate');

  const { writingHero, writingHeroKey, resetWritingHero } = useHeroStore();
  const setHeroUploading = useUIStore(state => state.setHeroUploading);

  const { validateHeroForm } = useHeroFormValidation();

  const [isPending, trigger] = useAuthMutation({
    axiosConfig: {
      url: '/v1/heroes',
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    onSuccess: () => {
      showToast('주인공이 생성되었습니다.');
      goBack();
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.hero.all });
    },
    onError: err => {
      logger.error('Failed to create hero', {
        error: err,
        writingHero,
      });
      showErrorToast('주인공 생성에 실패했습니다.');
    },
  });

  const goBack = useCallback(() => {
    resetWritingHero();
    if (options?.onSuccessNavigation) {
      options.onSuccessNavigation();
    } else {
      navigation.goBack();
    }
    publishHeroUpdate();
  }, [resetWritingHero, navigation, publishHeroUpdate, options]);

  const heroHttpPayLoad = HeroPayloadService.createHeroFormData(
    writingHeroKey ?? 0,
    writingHero,
  );

  useEffect(() => {
    setHeroUploading(isPending);
  }, [isPending, setHeroUploading]);

  const submit = useCallback(() => {
    void trigger({
      data: heroHttpPayLoad,
    });
  }, [trigger, heroHttpPayLoad]);

  const handleSubmit = useCallback(() => {
    if (!validateHeroForm(writingHero)) {
      return;
    }
    submit();
  }, [validateHeroForm, writingHero, submit]);

  return {
    createHero: handleSubmit,
    isPending,
  };
};

export type UseUpdateHeroReturn = {
  updateHero: () => void;
  isPending: boolean;
};

export const useUpdateHero = (): UseUpdateHeroReturn => {
  const navigation = useNavigation<BasicNavigationProps>();
  const queryClient = useQueryClient();
  const writingHeroKey = useHeroStore(state => state.writingHeroKey);
  const setWritingHeroKey = useHeroStore(state => state.setWritingHeroKey);
  const writingHero = useHeroStore(state => state.writingHero);
  const resetWritingHero = useHeroStore(state => state.resetWritingHero);
  const currentHero = useHeroStore(state => state.currentHero);

  const { validateHeroForm } = useHeroFormValidation();
  const publishHeroUpdate = useUpdatePublisher('heroUpdate');
  const publishCurrentHeroUpdate = useUpdatePublisher('currentHeroUpdate');

  const heroHttpPayLoad = writingHeroKey
    ? HeroPayloadService.createHeroFormData(writingHeroKey, writingHero)
    : null;

  const [isPending, trigger] = useAuthMutation<void>({
    axiosConfig: {
      method: 'put',
      url: `/v1/heroes/${writingHeroKey}`,
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    onSuccess: () => {
      showToast('주인공이 수정되었습니다.');
      setWritingHeroKey(undefined);
      resetWritingHero();
      publishHeroUpdate();
      if (currentHero?.id === writingHeroKey) {
        publishCurrentHeroUpdate();
      }
      navigation.goBack();
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.hero.all });
      if (writingHeroKey) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.hero.detail(writingHeroKey),
        });
      }
    },
    onError: err => {
      logger.error('Failed to update hero', {
        error: err,
        writingHeroKey,
        writingHero,
      });
      showErrorToast('주인공 수정에 실패했습니다.');
    },
  });

  const submit = function () {
    if (writingHeroKey === undefined || !heroHttpPayLoad) {
      return;
    }

    void trigger({ data: heroHttpPayLoad });
  };

  return {
    updateHero: () => {
      if (!validateHeroForm(writingHero)) {
        return;
      }
      submit();
    },
    isPending,
  };
};

export type UseDeleteHeroReturn = {
  deleteHero: () => void;
  isPending: boolean;
};

export const useDeleteHero = (): UseDeleteHeroReturn => {
  const navigation = useNavigation<BasicNavigationProps>();
  const queryClient = useQueryClient();
  const publishHeroUpdate = useUpdatePublisher('heroUpdate');
  const writingHeroKey = useHeroStore(state => state.writingHeroKey);
  const { setCurrentHero } = useHeroStore();

  const [, updateRecentHero] = useAuthMutation<void>({
    axiosConfig: {
      method: 'POST',
      url: '/v1/users/hero/recent',
    },
  });

  const [isPending, trigger] = useAuthMutation<void>({
    axiosConfig: {
      method: 'delete',
      url: `/v1/heroes/${writingHeroKey}`,
    },
    onSuccess: async () => {
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.hero.all });
      if (writingHeroKey) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.hero.detail(writingHeroKey),
        });
      }

      // Refetch heroes to get updated list
      const result = await queryClient.fetchQuery<HeroesQueryResponse>({
        queryKey: queryKeys.hero.all,
      });

      const heroes = result?.heroes || [];

      if (heroes.length === 0) {
        // No heroes left - navigate to hero registration
        CustomAlert.actionAlert({
          title: '주인공 삭제',
          desc: '주인공을 삭제하였습니다.',
          actionBtnText: '확인',
          action: () => {
            publishHeroUpdate();
            setCurrentHero(null);
            navigation.navigate('App', {
              screen: 'HeroSettingNavigator',
              params: {
                screen: 'HeroRegisterStep1',
                params: {
                  source: 'hero-deleted',
                },
              },
            });
          },
        });
      } else {
        // Set first hero as current and update backend
        const firstHero = heroes[0].hero;
        setCurrentHero(firstHero);

        void updateRecentHero({
          data: {
            heroNo: firstHero.id,
          },
        });

        CustomAlert.actionAlert({
          title: '주인공 삭제',
          desc: '주인공을 삭제하였습니다.',
          actionBtnText: '확인',
          action: () => {
            publishHeroUpdate();
            navigation.navigate('App', {
              screen: 'Home',
            });
          },
        });
      }
    },
    onError: _err => {
      CustomAlert.retryAlert(
        '삭제를 실패했습니다.',
        () => {
          void trigger();
        },
        () => {},
      );
    },
  });

  return {
    deleteHero: () => void trigger(),
    isPending,
  };
};

type UseRegisterSharedHeroParams = {
  shareKey?: string;
  onRegisterSuccess?: () => void;
};

export const useRegisterSharedHero = ({
  shareKey,
  onRegisterSuccess,
}: UseRegisterSharedHeroParams): void => {
  const queryClient = useQueryClient();
  const isLoggedIn = useAuthStore(state => state.isLoggedIn());
  const setShareKey = useShareStore(state => state.setShareKey);

  const [, trigger] = useAuthMutation<any>({
    axiosConfig: {
      url: '/v1/heroes/auth',
      method: 'post',
    },
    onSuccess: () => {
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.hero.all });
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
            void trigger({
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
      void trigger({
        params: {
          shareKey,
        },
      });
    }
  }, [isLoggedIn, trigger, setShareKey, shareKey]);
};
