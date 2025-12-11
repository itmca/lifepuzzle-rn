import { useState } from 'react';
import {
  AiGallery,
  AiPhotoTemplate,
} from '../../types/external/ai-photo.type.ts';
import { useHeroStore } from '../../stores/hero.store.ts';
import logger from '../../utils/logger.util';
import { useAuthQuery } from '../core/auth-query.hook.ts';

interface AiPhotoTemplateQueryResponse {
  drivingVideos: AiPhotoTemplate[];
}

interface UseAiPhotoTemplateReturn {
  drivingVideos: AiPhotoTemplate[];
  isLoading: boolean;
  refetch: () => void;
}
interface AiGalleriesQueryResponse {
  gallery: AiGallery[];
}

interface UseAiGalleriesReturn {
  gallery: AiGallery[];
  isLoading: boolean;
  refetch: () => void;
}

//TODO: 임시 API
export const useAiPhotoTemplate = (): UseAiPhotoTemplateReturn => {
  const [aiPhotoTemplate, setAiPhotoTemplate] = useState<AiPhotoTemplate[]>([]);
  const { isFetching: isLoading, refetch: fetchAiPhotoTemplate } =
    useAuthQuery<AiPhotoTemplateQueryResponse>({
      queryKey: ['ai-driving-videos'],
      axiosConfig: {
        method: 'GET',
        url: '/v1/ai/driving-videos',
      },
      onSuccess: res => {
        if (res && res.drivingVideos) {
          setAiPhotoTemplate(res.drivingVideos);
        }
      },
      onError: err => {
        logger.error('Failed to fetch AI photo templates', { error: err });
      },
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
  const { isFetching: isLoading, refetch: fetchAiGalleries } =
    useAuthQuery<AiGalleriesQueryResponse>({
      queryKey: ['ai-galleries', hero?.id],
      axiosConfig: {
        method: 'GET',
        url: `/v1/galleries/ai?heroId=${hero?.id || 0}`,
      },
      enabled: Boolean(hero?.id),
      onSuccess: res => {
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
    });

  return {
    gallery,
    isLoading,
    refetch: fetchAiGalleries,
  };
};
