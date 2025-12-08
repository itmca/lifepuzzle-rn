import { FacebookPhotosResponse } from '../external/facebook.type';
import { AxiosError } from 'axios';

export interface UseFacebookPhotosProps {
  onSuccess?: (photos: FacebookPhotosResponse) => void;
  onError?: (error: AxiosError) => void;
}
