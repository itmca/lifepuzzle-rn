import {useAuthAxios} from './network.hook';
import {useNavigation} from '@react-navigation/native';
import {useRecoilValue} from 'recoil';
import {BasicNavigationProps} from '../../navigation/types';
import {userState} from '../../recoils/user.recoil';
import {CustomAlert} from '../../components/alert/CustomAlert';
import {showErrorToast} from '../../components/styled/components/Toast';
interface AiPhotoCreateRequest {
  heroNo: number;
  galleryId: number;
  drivingVideoId: number;
}
interface UseCreateAiPhotoReturn {
  submit: () => void;
  submitWithErrorHandling: () => Promise<boolean>;
  isLoading: boolean;
}
export const useCreateAiPhoto = (
  request: AiPhotoCreateRequest,
): UseCreateAiPhotoReturn => {
  const navigation = useNavigation<BasicNavigationProps>();
  const user = useRecoilValue(userState);
  //TODO: 임시 API
  const [isLoading, createAiPhoto] = useAuthAxios<any>({
    requestOption: {
      method: 'post',
      url: `/v1/ai/videos`,
      data: {
        heroNo: request.heroNo,
        galleryId: request.galleryId,
        drivingVideoId: request.drivingVideoId,
      },
    },
    onResponseSuccess: res => {
      navigation.push('NoTab', {
        screen: 'AiPhotoNavigator',
        params: {
          screen: 'AiPhotoWorkHistory',
        },
      });
    },
    onError: err => {
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

    return new Promise(resolve => {
      createAiPhoto({
        data: {
          heroNo: request.heroNo,
          galleryId: request.galleryId,
          drivingVideoId: request.drivingVideoId,
        },
        onResponseSuccess: () => {
          navigation.push('NoTab', {
            screen: 'AiPhotoNavigator',
            params: {
              screen: 'AiPhotoWorkHistory',
            },
          });
          resolve(true);
        },
        onError: () => {
          showErrorToast('AI 포토 생성을 실패했습니다. 재시도 부탁드립니다.');
          resolve(false);
        },
      });
    });
  };

  function validate(): boolean {
    if (!request.drivingVideoId) {
      showErrorToast('움직임을 선택해 주세요.');
      return false;
    }
    return true;
  }
  return {submit, submitWithErrorHandling, isLoading};
};
