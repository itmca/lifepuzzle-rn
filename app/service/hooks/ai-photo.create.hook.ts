import {useAuthAxios} from './network.hook';
import {useNavigation} from '@react-navigation/native';
import {useRecoilValue} from 'recoil';
import {BasicNavigationProps} from '../../navigation/types';
import {userState} from '../../recoils/user.recoil';
import {CustomAlert} from '../../components/alert/CustomAlert';
interface AiPhotoCreateRequest {
  galleryId: number;
  templateId: number;
}
interface UseCreateAiPhotoReturn {
  submit: () => void;
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
      url: `/v1/ai-photo/${String(user?.userNo)}/${request.galleryId}`,
    },
    onResponseSuccess: res => {
      //TODO: 추후 AI포토 작업 내역 화면으로 변경 예정
      navigation.navigate('HomeTab', {screen: 'Home'});
    },
    onError: err => {
      CustomAlert.simpleAlert(
        'AI 포토 생성을 실패했습니다. 재시도 부탁드립니다.',
      );
    },
    disableInitialRequest: true,
  });

  const submit = function () {
    if (validate()) {
      createAiPhoto({
        data: {
          templateId: request.templateId,
        },
      });
    }
  };
  function validate(): boolean {
    if (!request.templateId) {
      CustomAlert.simpleAlert('움직임을 선택해 주세요.');
      return false;
    }
    return true;
  }
  return {submit, isLoading};
};
