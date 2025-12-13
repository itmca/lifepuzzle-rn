import { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
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
import { HeroPayloadService } from './hero-payload.service';
import { useAuthValidation, useFieldValidation } from '../auth/validation.hook';
import { useErrorHandler } from '../common/error-handler.hook';
import { queryKeys } from '../core/query-keys';
import logger from '../../utils/logger.util';

export type UseCreateHeroReturn = {
  createHero: () => void;
  isPending: boolean;
};

export const useCreateHero = (): UseCreateHeroReturn => {
  const navigation = useNavigation<BasicNavigationProps>();
  const queryClient = useQueryClient();
  const publishHeroUpdate = useUpdatePublisher('heroUpdate');

  const { writingHero, writingHeroKey, resetWritingHero } = useHeroStore();
  const setHeroUploading = useUIStore(state => state.setHeroUploading);

  const { validateRequired } = useFieldValidation();
  const { validateLogin } = useAuthValidation();
  const { handleCreateError } = useErrorHandler();

  const [isPending, trigger] = useAuthMutation({
    axiosConfig: {
      url: '/v1/heroes',
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    onSuccess: () => {
      CustomAlert.actionAlert({
        title: '주인공 생성',
        desc: '주인공이 생성되었습니다.',
        actionBtnText: '확인',
        action: goBack,
      });
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.hero.all });
    },
    onError: () => {
      handleCreateError('주인공', submit, goBack);
    },
  });

  const goBack = useCallback(() => {
    resetWritingHero();
    navigation.goBack();
    publishHeroUpdate();
  }, [resetWritingHero, navigation, publishHeroUpdate]);

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

  const validate = useCallback((): boolean => {
    return (
      validateRequired(writingHero?.name, '이름') &&
      validateRequired(writingHero?.nickName, '닉네임') &&
      validateRequired(writingHero?.birthday?.toString(), '태어난 날') &&
      validateLogin(navigation)
    );
  }, [validateRequired, validateLogin, writingHero, navigation]);

  const handleSubmit = useCallback(() => {
    if (!validate()) {
      return;
    }
    submit();
  }, [validate, submit]);

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
  const isLoggedIn = useAuthStore(state => state.isLoggedIn());

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
      CustomAlert.simpleAlert('주인공이 수정되었습니다.');
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
      CustomAlert.retryAlert(
        '주인공 수정 실패했습니다.',
        submit,
        navigation.goBack,
      );
    },
  });

  const submit = function () {
    if (writingHeroKey === undefined || !heroHttpPayLoad) {
      return;
    }

    void trigger({ data: heroHttpPayLoad });
  };

  function validate(): boolean {
    if (!writingHero?.name) {
      CustomAlert.simpleAlert('이름을 입력해주세요.');
      return false;
    } else if (!writingHero?.nickName) {
      CustomAlert.simpleAlert('닉네임을 입력해주세요.');
      return false;
    } else if (!writingHero?.birthday) {
      CustomAlert.simpleAlert('태어난 날 을 입력해주세요.');
      return false;
    } else if (!isLoggedIn) {
      Alert.alert(
        '미로그인 시점에 작성한 이야기는 저장할 수 없습니다.',
        '',
        [
          {
            text: '로그인하러가기',
            style: 'default',
            onPress: () => {
              navigation.navigate('Auth', {
                screen: 'LoginRegisterNavigator',
                params: {
                  screen: 'LoginMain',
                },
              });
            },
          },
          { text: '계속 둘러보기', style: 'default' },
        ],
        {
          cancelable: true,
        },
      );
      return false;
    }

    return true;
  }

  return {
    updateHero: () => {
      if (!validate()) {
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

  const [isPending, trigger] = useAuthMutation<void>({
    axiosConfig: {
      method: 'delete',
      url: `/v1/heroes/${writingHeroKey}`,
    },
    onSuccess: () => {
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
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.hero.all });
      if (writingHeroKey) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.hero.detail(writingHeroKey),
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
