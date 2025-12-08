import { useState } from 'react';
import { useAuthAxios } from '../core/auth-http.hook.ts';
import { AxiosRequestConfig } from 'axios';
import {
  AiGallery,
  AiPhotoTemplate,
} from '../../types/external/ai-photo.type.ts';
import { useHeroStore } from '../../stores/hero.store.ts';
import logger from '../../utils/logger.util';

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
      onError: err => {
        logger.error('Failed to fetch AI photo templates', { error: err });
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
  const hero = useHeroStore(state => state.currentHero);
  const [gallery, setGallery] = useState<AiGallery[]>([]);
  const [isLoading, fetchAiGalleries] = useAuthAxios<AiGalleriesQueryResponse>({
    requestOption: {
      method: 'GET',
      url: `/v1/galleries/ai?heroId=${hero?.id || 0}`,
    },
    onResponseSuccess: res => {
      if (res && res.gallery) {
        setGallery(res.gallery);
      }
    },
    onError: err => {
      logger.error('Failed to fetch AI galleries', {
        error: err,
        heroId: hero?.id,
      });
    },
    disableInitialRequest: false,
  });

  return {
    gallery,
    isLoading,
    refetch: fetchAiGalleries,
  };
};
