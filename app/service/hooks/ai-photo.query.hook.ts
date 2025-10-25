import {useState} from 'react';
import {useAuthAxios} from './network.hook';
import {AxiosRequestConfig} from 'axios';
import {AiGallery, AiPhotoTemplate} from '../../types/ai-photo.type';
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

//TODO: 임시 API
export const useAiPhotoTemplate = (): UseAiPhotoTemplateReturn => {
  const [aiPhotoTemplate, setAiPhotoTemplate] = useState<AiPhotoTemplate[]>([]);
  const [isLoading, fetchAiPhotoTemplate] =
    useAuthAxios<AiPhotoTemplateQueryResponse>({
      requestOption: {
        method: 'GET',
        url: '/v1/ai/driving-videos',
      },
      onResponseSuccess: res => {
        if (res && res.drivingVideos) {
          setAiPhotoTemplate(res.drivingVideos);
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
