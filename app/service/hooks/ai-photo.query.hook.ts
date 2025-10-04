import {useCallback, useState} from 'react';
import {useAuthAxios} from './network.hook';
import {AxiosRequestConfig} from 'axios';
import {AiGallery, AiPhotoTemplate} from '../../types/ai-photo.type';
import {createThumbnail} from 'react-native-create-thumbnail';
import {heroState} from '../../recoils/hero.recoil';
import {HeroType} from '../../types/hero.type';
import {useRecoilValue} from 'recoil';

interface AiPhotoTemplateQueryResponse {
  drivingVideos: AiPhotoTemplate[];
}

interface UseAiPhotoTemplateReturn {
  drivingVideos: AiPhotoTemplate[];
  isLoading: boolean;
  refetch: (newRequestOption: Partial<AxiosRequestConfig>) => void;
}
interface AiGalleriesQueryResponse {
  gallery: AiGallery[];
}

interface UseAiGalleriesReturn {
  gallery: AiGallery[];
  isLoading: boolean;
  refetch: (newRequestOption: Partial<AxiosRequestConfig>) => void;
}
const initialAiPhotoTemplate: AiPhotoTemplate[] = [
  {
    id: 1,
    name: 'A',
    thumbnailUrl:
      'https://lp-public.s3.ap-northeast-2.amazonaws.com/hero/27/image/714/640/IMG_0111_1747228572.webp',
    url: 'https://lp-public.s3.ap-northeast-2.amazonaws.com/not-login-stories/family.mp4',
  },
  {
    id: 2,
    name: 'B',
    thumbnailUrl:
      'https://lp-public.s3.ap-northeast-2.amazonaws.com/hero/27/image/714/640/IMG_0111_1747228572.webp',
    url: 'https://lp-public.s3.ap-northeast-2.amazonaws.com/not-login-stories/family.mp4',
  },
  {
    id: 3,
    name: 'C',
    thumbnailUrl:
      'https://lp-public.s3.ap-northeast-2.amazonaws.com/hero/27/image/714/640/IMG_0111_1747228572.webp',
    url: 'https://lp-public.s3.ap-northeast-2.amazonaws.com/not-login-stories/family.mp4',
  },
  {
    id: 4,
    name: 'D',
    thumbnailUrl:
      'https://lp-public.s3.ap-northeast-2.amazonaws.com/hero/27/image/714/640/IMG_0111_1747228572.webp',
    url: 'https://lp-public.s3.ap-northeast-2.amazonaws.com/not-login-stories/family.mp4',
  },
  {
    id: 5,
    name: 'E',
    thumbnailUrl:
      'https://lp-public.s3.ap-northeast-2.amazonaws.com/hero/27/image/714/640/IMG_0111_1747228572.webp',
    url: 'https://lp-public.s3.ap-northeast-2.amazonaws.com/not-login-stories/family.mp4',
  },
  {
    id: 6,
    name: 'F',
    thumbnailUrl:
      'https://lp-public.s3.ap-northeast-2.amazonaws.com/hero/27/image/714/640/IMG_0111_1747228572.webp',
    url: 'https://lp-public.s3.ap-northeast-2.amazonaws.com/not-login-stories/family.mp4',
  },
];
const initialAiGalleries: AiGallery[] = [
  {
    id: 1,
    status: 'IN_PROGRESS',
    requestedAt: '2025-10-04T14:23:00+09:00',
    completedAt: '2025-02-13T14:25:00+09:00',
    createdBy: '홍길동',
    thumbnailUrl:
      'https://lp-public.s3.ap-northeast-2.amazonaws.com/not-login-stories/gallery/30-1.jpg',
    videoUrl: 'https://cdn.example.com/videos/vid_02.mp4',
  },
  {
    id: 2,
    status: 'COMPLETED',
    requestedAt: '2025-02-13T14:23:00+09:00',
    completedAt: '2025-02-13T14:25:00+09:00',
    createdBy: '홍길동',
    thumbnailUrl:
      'https://lp-public.s3.ap-northeast-2.amazonaws.com/not-login-stories/gallery/30-1.jpg',
    videoUrl: 'https://cdn.example.com/videos/vid_02.mp4',
  },
];
//TODO: 임시 API
export const useAiPhotoTemplate = (): UseAiPhotoTemplateReturn => {
  const [aiPhotoTemplate, setAiPhotoTemplate] = useState<AiPhotoTemplate[]>([]);
  const [isLoading, fetchAiPhotoTemplate] =
    useAuthAxios<AiPhotoTemplateQueryResponse>({
      requestOption: {
        method: 'GET',
        url: `/v1/ai/driving-videos`,
      },
      onResponseSuccess: res => {
        if (res && res.drivingVideos) {
          setAiPhotoTemplate(aiPhotoTemplate);
        }
      },
      onError: () => {
        // TODO: 예외 처리
      },
      disableInitialRequest: false,
    });

  return {
    drivingVideos: aiPhotoTemplate,
    isLoading,
    refetch: fetchAiPhotoTemplate,
  };
};

export const useAiGalleries = (): UseAiGalleriesReturn => {
  const hero = useRecoilValue<HeroType>(heroState);
  const [gallery, setGallery] = useState<AiGallery[]>([]);
  const [isLoading, fetchAiGalleries] = useAuthAxios<AiGalleriesQueryResponse>({
    requestOption: {
      method: 'GET',
      url: `/v1/galleries/ai?heroId=${hero.heroNo}`,
    },
    onResponseSuccess: res => {
      if (res && res.gallery) {
        setGallery(res.gallery);
      }
    },
    onError: err => {},
    disableInitialRequest: false,
  });

  return {
    gallery,
    isLoading,
    refetch: fetchAiGalleries,
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
