import { useAuthMutation } from '../core/auth-mutation.hook.ts';
import { useNavigation } from '@react-navigation/native';

import { BasicNavigationProps } from '../../navigation/types.tsx';
import { showErrorToast } from '../../components/ui/feedback/Toast.tsx';
import logger from '../../utils/logger.util';

interface AiPhotoCreateRequest {
  heroId: number;
  galleryId: number;
  drivingVideoId: number;
}

interface AiPhotoCreateResponse {
  videoId: string;
  status: 'pending' | 'processing' | 'completed';
}

interface UseCreateAiPhotoReturn {
  submit: () => void;
  submitWithErrorHandling: () => Promise<boolean>;
  submitWithParams: (params: AiPhotoCreateRequest) => void;
  isLoading: boolean;
}
export const useCreateAiPhoto = (
  request: AiPhotoCreateRequest,
): UseCreateAiPhotoReturn => {
  const navigation = useNavigation<BasicNavigationProps>();
  //TODO: 임시 API
  const [isLoading, createAiPhoto] = useAuthMutation<AiPhotoCreateResponse>({
    axiosConfig: {
      method: 'post',
      url: '/v1/ai/videos',
      data: {
        heroId: request.heroId,
        galleryId: request.galleryId,
        drivingVideoId: request.drivingVideoId,
      },
    },
    onSuccess: _res => {
      navigation.navigate('App', {
        screen: 'AiPhotoNavigator',
        params: {
          screen: 'AiPhotoWorkHistory',
        },
      });
    },
    onError: err => {
      logger.error('Failed to create AI photo', { error: err, request });
      showErrorToast('AI 포토 생성을 실패했습니다. 재시도 부탁드립니다.');
    },
  });

  const submit = function () {
    if (validate()) {
      void createAiPhoto({
        data: {
          heroId: request.heroId,
          galleryId: request.galleryId,
          drivingVideoId: request.drivingVideoId,
        },
      });
    }
  };

  const submitWithErrorHandling = async (): Promise<boolean> => {
    if (!validate()) {
      return false;
    }

    try {
      await createAiPhoto({
        data: {
          heroId: request.heroId,
          galleryId: request.galleryId,
          drivingVideoId: request.drivingVideoId,
        },
      });

      navigation.navigate('App', {
        screen: 'AiPhotoNavigator',
        params: {
          screen: 'AiPhotoWorkHistory',
        },
      });

      return true;
    } catch (error) {
      logger.error('Failed to create AI photo with error handling', {
        error,
        request,
      });
      showErrorToast('AI 포토 생성을 실패했습니다. 재시도 부탁드립니다.');
      return false;
    }
  };

  const submitWithParams = (params: AiPhotoCreateRequest) => {
    if (validateParams(params)) {
      void createAiPhoto({
        data: {
          heroId: params.heroId,
          galleryId: params.galleryId,
          drivingVideoId: params.drivingVideoId,
        },
      });
    }
  };

  function validate(): boolean {
    if (!request.drivingVideoId) {
      showErrorToast('움직임을 선택해 주세요.');
      return false;
    }
    return true;
  }

  function validateParams(params: AiPhotoCreateRequest): boolean {
    if (!params.drivingVideoId) {
      showErrorToast('움직임을 선택해 주세요.');
      return false;
    }
    return true;
  }

  return { submit, submitWithErrorHandling, submitWithParams, isLoading };
};
