import {useState} from 'react';
import {useAuthAxios} from '../core/auth-http.hook';
import {FacebookPhotosResponse} from '../../types/external/facebook.type';
import {UseFacebookPhotosProps} from '../../types/hooks/facebook.type';

export const useFacebookPhotos = ({
  onSuccess,
  onError,
}: UseFacebookPhotosProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [photos, setPhotos] = useState<FacebookPhotosResponse | null>(null);

  const [_, fetchPhotos] = useAuthAxios<FacebookPhotosResponse>({
    requestOption: {
      method: 'GET',
      url: '/v1/facebook/photos',
    },
    onResponseSuccess: response => {
      setPhotos(response);
      onSuccess?.(response);
    },
    onError: (error: AxiosError) => {
      console.error('Facebook photos fetch failed:', error);
      onError?.(error);
    },
    onLoadingStatusChange: setIsLoading,
  });

  const getFacebookPhotos = (code: string) => {
    fetchPhotos({
      params: {code},
    });
  };

  return {
    isLoading,
    photos,
    getFacebookPhotos,
  };
};
