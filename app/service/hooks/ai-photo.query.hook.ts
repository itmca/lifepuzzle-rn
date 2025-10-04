import {useCallback, useState} from 'react';
import {useAuthAxios} from './network.hook';
import {AxiosRequestConfig} from 'axios';
import {AiPhotoTemplate} from '../../types/ai-photo.type';
import {createThumbnail} from 'react-native-create-thumbnail';

interface AiPhotoTemplateQueryResponse {
  aiPhotoTemplate: AiPhotoTemplate[];
}

interface UseAiPhotoTemplateReturn {
  aiPhotoTemplate: AiPhotoTemplate[];
  isLoading: boolean;
  refetch: (newRequestOption: Partial<AxiosRequestConfig>) => void;
}
const initialAiPhotoTemplate: AiPhotoTemplate[] = [
  {
    id: 1,
    title: 'A',
    thumbnail:
      'https://lp-public.s3.ap-northeast-2.amazonaws.com/hero/27/image/714/640/IMG_0111_1747228572.webp',
    uri: 'https://lp-public.s3.ap-northeast-2.amazonaws.com/not-login-stories/family.mp4',
  },
  {
    id: 2,
    title: 'B',
    thumbnail:
      'https://lp-public.s3.ap-northeast-2.amazonaws.com/hero/27/image/714/640/IMG_0111_1747228572.webp',
    uri: 'https://lp-public.s3.ap-northeast-2.amazonaws.com/not-login-stories/family.mp4',
  },
  {
    id: 3,
    title: 'C',
    thumbnail:
      'https://lp-public.s3.ap-northeast-2.amazonaws.com/hero/27/image/714/640/IMG_0111_1747228572.webp',
    uri: 'https://lp-public.s3.ap-northeast-2.amazonaws.com/not-login-stories/family.mp4',
  },
  {
    id: 4,
    title: 'D',
    thumbnail:
      'https://lp-public.s3.ap-northeast-2.amazonaws.com/hero/27/image/714/640/IMG_0111_1747228572.webp',
    uri: 'https://lp-public.s3.ap-northeast-2.amazonaws.com/not-login-stories/family.mp4',
  },
  {
    id: 5,
    title: 'E',
    thumbnail:
      'https://lp-public.s3.ap-northeast-2.amazonaws.com/hero/27/image/714/640/IMG_0111_1747228572.webp',
    uri: 'https://lp-public.s3.ap-northeast-2.amazonaws.com/not-login-stories/family.mp4',
  },
  {
    id: 6,
    title: 'F',
    thumbnail:
      'https://lp-public.s3.ap-northeast-2.amazonaws.com/hero/27/image/714/640/IMG_0111_1747228572.webp',
    uri: 'https://lp-public.s3.ap-northeast-2.amazonaws.com/not-login-stories/family.mp4',
  },
];
//TODO: 임시 API
export const useAiPhotoTemplate = (): UseAiPhotoTemplateReturn => {
  const [aiPhotoTemplate, setAiPhotoTemplate] = useState<AiPhotoTemplate[]>(
    initialAiPhotoTemplate,
  );
  const [isLoading, fetchAiPhotoTemplate] =
    useAuthAxios<AiPhotoTemplateQueryResponse>({
      requestOption: {
        url: `/v1/ai-photo-template`,
      },
      onResponseSuccess: res => {
        if (res && res.aiPhotoTemplate) {
          setAiPhotoTemplate(aiPhotoTemplate);
        }
      },
      onError: () => {
        // TODO: 예외 처리
      },
      disableInitialRequest: false,
    });

  return {
    aiPhotoTemplate,
    isLoading,
    refetch: fetchAiPhotoTemplate,
  };
};
export const useVideoThumbnail = () => {
  const [isLoading, setIsLoading] = useState(false);

  const generateThumbnail = useCallback(
    async (videoUri: string, timeStamp: number = 10000) => {
      setIsLoading(true);
      try {
        const response = await createThumbnail({
          url: videoUri,
          timeStamp,
          quality: 0.8,
          format: 'jpeg',
        });

        setIsLoading(false);
        return response.path;
      } catch (error) {
        console.error('섬네일 생성 실패:', error);
        setIsLoading(false);
        return null;
      }
    },
    [],
  );

  return {generateThumbnail, isLoading};
};
