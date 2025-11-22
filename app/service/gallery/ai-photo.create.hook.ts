import { useAuthAxios } from '../core/auth-http.hook';
import { useNavigation } from '@react-navigation/native';

import { BasicNavigationProps } from '../../navigation/types';
import { showErrorToast } from '../../components/ui/feedback/Toast';

interface AiPhotoCreateRequest {
  heroNo: number;
  galleryId: number;
  drivingVideoId: number;
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
  const [isLoading, createAiPhoto] = useAuthAxios<any>({
    requestOption: {
      method: 'post',
      url: '/v1/ai/videos',
      data: {
        heroNo: request.heroNo,
        galleryId: request.galleryId,
        drivingVideoId: request.drivingVideoId,
      },
    },
    onResponseSuccess: _res => {
      navigation.push('App', {
        screen: 'AiPhotoNavigator',
        params: {
          screen: 'AiPhotoWorkHistory',
        },
      });
    },
    onError: _err => {
      showErrorToast('AI 포토 생성을 실패했습니다. 재시도 부탁드립니다.');
    },
    disableInitialRequest: true,
  });

  const submit = function () {
    if (validate()) {
      createAiPhoto({
        data: {
          heroNo: request.heroNo,
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
          heroNo: request.heroNo,
          galleryId: request.galleryId,
          drivingVideoId: request.drivingVideoId,
        },
      });

      navigation.push('App', {
        screen: 'AiPhotoNavigator',
        params: {
          screen: 'AiPhotoWorkHistory',
        },
      });

      return true;
    } catch (error) {
      showErrorToast('AI 포토 생성을 실패했습니다. 재시도 부탁드립니다.');
      return false;
    }
  };

  const submitWithParams = (params: AiPhotoCreateRequest) => {
    if (validateParams(params)) {
      createAiPhoto({
        data: {
          heroNo: params.heroNo,
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
