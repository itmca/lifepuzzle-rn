import {Platform} from 'react-native';
import Config from 'react-native-config';

export const SERVER_HOST: string =
  (Platform.OS === 'android' && Config.API_URL_ANDROID
    ? Config.API_URL_ANDROID
    : Config.API_URL) || '';
