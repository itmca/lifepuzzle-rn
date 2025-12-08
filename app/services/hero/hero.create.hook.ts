import { useNavigation } from '@react-navigation/native';
import { BasicNavigationProps } from '../../navigation/types.tsx';
import { useUpdatePublisher } from '../common/update.hook.ts';
import { useCallback, useEffect } from 'react';
import { useHeroStore } from '../../stores/hero.store.ts';
import { useUIStore } from '../../stores/ui.store.ts';
import { useAuthAxios } from '../core/auth-http.hook.ts';
import { CustomAlert } from '../../components/ui/feedback/CustomAlert.tsx';
import { HeroPayloadService } from './hero-payload.service.ts';
import {
  useAuthValidation,
  useFieldValidation,
} from '../auth/validation.hook.ts';
import { useErrorHandler } from '../common/error-handler.hook.ts';

export const useCreateHero = (): [() => void, boolean] => {
  const navigation = useNavigation<BasicNavigationProps>();
  const publishHeroUpdate = useUpdatePublisher('heroUpdate');

  const { writingHero, writingHeroKey, resetWritingHero } = useHeroStore();
  const { setUploadState } = useUIStore();
  const setHeroUploading = useCallback(
    (value: boolean) => setUploadState({ hero: value }),
    [setUploadState],
  );

  const { validateRequired } = useFieldValidation();
  const { validateLogin } = useAuthValidation();
  const { handleCreateError } = useErrorHandler();

  const [isLoading, registerHero] = useAuthAxios({
    requestOption: {
      url: '/v1/heroes',
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    onResponseSuccess: () => {
      CustomAlert.actionAlert({
        title: '주인공 생성',
        desc: '주인공이 생성되었습니다.',
        actionBtnText: '확인',
        action: goBack,
      });
    },
    onError: () => {
      handleCreateError('주인공', submit, goBack);
    },
    disableInitialRequest: true,
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
    setHeroUploading(isLoading);
  }, [isLoading, setHeroUploading]);

  const submit = useCallback(() => {
    registerHero({
      data: heroHttpPayLoad,
    });
  }, [registerHero]);

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

  return [handleSubmit, isLoading];
};
