import {useState} from 'react';
import {useAuthAxios} from './network.hook';
import {FacebookPhotosResponse} from '../../types/facebook.type';

interface UseFacebookPhotosProps {
  onSuccess?: (photos: FacebookPhotosResponse) => void;
  onError?: (error: any) => void;
}

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
    onError: error => {
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
