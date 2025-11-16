// TODO: Migrate to new pattern - use ./domain/hero/use-hero-create.ts instead
// This file is deprecated and will be removed in future versions
// New usage: import { useCreateHero } from '@/service/hooks/domain/hero/use-hero-create';

import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';
import {useUpdatePublisher} from './update.hook';
import {useEffect, useCallback} from 'react';
import {useHeroStore} from '../../stores/hero.store';
import {useUiStore} from '../../stores/ui.store';
import {useAuthAxios} from './network.hook';
import {CustomAlert} from '../../components/ui/feedback/CustomAlert';
import {useHeroHttpPayLoad} from './hero.payload.hook.ts';
import {useFieldValidation, useAuthValidation} from './common/validation.hook';
import {useErrorHandler} from './common/error-handler.hook';

export const useCreateHero = (): [() => void, boolean] => {
  const navigation = useNavigation<BasicNavigationProps>();
  const publishHeroUpdate = useUpdatePublisher('heroUpdate');

  const {writingHero, resetWritingHero} = useHeroStore();
  const {setUploadState} = useUiStore();
  const setHeroUploading = useCallback(
    (value: boolean) => setUploadState({hero: value}),
    [setUploadState],
  );

  const {validateRequired} = useFieldValidation();
  const {validateLogin} = useAuthValidation();
  const {handleCreateError} = useErrorHandler();

  const [isLoading, registerHero] = useAuthAxios({
    requestOption: {
      url: '/v1/heroes',
      method: 'post',
      headers: {'Content-Type': 'multipart/form-data'},
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

  const heroHttpPayLoad = useHeroHttpPayLoad();

  useEffect(() => {
    setHeroUploading(isLoading);
  }, [isLoading, setHeroUploading]);

  const submit = useCallback(() => {
    registerHero({
      data: heroHttpPayLoad,
    });
  }, [registerHero, heroHttpPayLoad]);

  const validate = useCallback((): boolean => {
    return (
      validateRequired(writingHero?.heroName, '이름') &&
      validateRequired(writingHero?.heroNickName, '닉네임') &&
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
