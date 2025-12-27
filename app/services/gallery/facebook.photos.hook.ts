import { useState } from 'react';
import { AxiosError } from 'axios';
import { useAuthMutation } from '../core/auth-mutation.hook.ts';
import { FacebookPhotosResponse } from '../../types/external/facebook.type.ts';
import { logger } from '../../utils/logger.util.ts';

export type UseFacebookPhotosProps = {
  onSuccess?: (photos: FacebookPhotosResponse) => void;
  onError?: (error: AxiosError) => void;
};

export const useFacebookPhotos = ({
  onSuccess,
  onError,
}: UseFacebookPhotosProps = {}) => {
  const [photos, setPhotos] = useState<FacebookPhotosResponse | null>(null);

  const [isLoading, fetchPhotos] = useAuthMutation<FacebookPhotosResponse>({
    axiosConfig: {
      method: 'GET',
      url: '/v1/facebook/photos',
    },
    onSuccess: response => {
      setPhotos(response);
      onSuccess?.(response);
    },
    onError: (error: AxiosError) => {
      logger.error('Facebook photos fetch failed:', error);
      onError?.(error);
    },
  });

  const getFacebookPhotos = (code: string) => {
    void fetchPhotos({
      params: { code },
    });
  };

  return {
    isLoading,
    photos,
    getFacebookPhotos,
  };
};
