import {useCallback, useEffect, useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../../../navigation/types';
import {useHeroStore} from '../../../../stores/hero.store';
import {useUiStore} from '../../../../stores/ui.store';
import {useApi} from '../../core/use-api';
import {createApiHook} from '../../core/api-hook.factory';
import {CustomAlert} from '../../../../components/ui/feedback/CustomAlert';
import {useHeroHttpPayLoad} from '../hero/use-hero-payload';
import {
  useFieldValidation,
  useAuthValidation,
} from '../../utils/use-validation';
import {createErrorHandler} from '../../../error/error-handler.service';
import {useUpdatePublisher} from '../../utils/use-update-publisher';

/**
 * Hero 생성을 위한 개선된 Hook
 * 기존 hero.create.hook.ts를 새로운 패턴으로 마이그레이션
 */
export const useCreateHero = (): [() => void, boolean] => {
  const navigation = useNavigation<BasicNavigationProps>();
  const api = useApi();
  const errorHandler = createErrorHandler('주인공');
  const publishHeroUpdate = useUpdatePublisher('heroUpdate');

  // Store hooks
  const {writingHero, resetWritingHero} = useHeroStore();
  const {setUploadState} = useUiStore();

  // Validation hooks
  const {validateRequired} = useFieldValidation();
  const {validateLogin} = useAuthValidation();

  // Payload hook
  const heroHttpPayLoad = useHeroHttpPayLoad();

  // Upload state management
  const setHeroUploading = useCallback(
    (value: boolean) => setUploadState({hero: value}),
    [setUploadState],
  );

  // Navigation callback
  const goBack = useCallback(() => {
    resetWritingHero();
    navigation.goBack();
    publishHeroUpdate();
  }, [resetWritingHero, navigation, publishHeroUpdate]);

  // API Hook for creating hero
  const createHeroHook = useMemo(
    () =>
      createApiHook(api, {
        url: '/v1/heroes',
        method: 'POST',
        entityName: '주인공',
        enabledByDefault: false,
        onSuccess: () => {
          CustomAlert.actionAlert({
            title: '주인공 생성',
            desc: '주인공이 생성되었습니다.',
            actionBtnText: '확인',
            action: goBack,
          });
        },
        onError: error => {
          errorHandler.handleCreateError(error, submit, goBack);
        },
      }),
    [api, goBack, errorHandler],
  );

  const {loading, execute} = createHeroHook();

  // Sync upload state with loading
  useEffect(() => {
    setHeroUploading(loading);
  }, [loading, setHeroUploading]);

  // Submit function
  const submit = useCallback(() => {
    execute({
      options: {
        headers: {'Content-Type': 'multipart/form-data'},
        data: heroHttpPayLoad,
      },
    });
  }, [execute, heroHttpPayLoad]);

  // Validation function
  const validate = useCallback((): boolean => {
    return (
      validateRequired(writingHero?.heroName, '이름') &&
      validateRequired(writingHero?.heroNickName, '닉네임') &&
      validateRequired(writingHero?.birthday?.toString(), '태어난 날') &&
      validateLogin(navigation)
    );
  }, [validateRequired, validateLogin, writingHero, navigation]);

  // Main submit handler
  const handleSubmit = useCallback(() => {
    if (!validate()) {
      return;
    }
    submit();
  }, [validate, submit]);

  return [handleSubmit, loading];
};
