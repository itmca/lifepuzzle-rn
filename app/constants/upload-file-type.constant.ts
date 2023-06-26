import {Platform} from 'react-native';

export const AUDIO_TYPE = Platform.OS === 'ios' ? 'audio/x-m4a' : 'audio/mp4';
export const IMG_TYPE = Platform.OS === 'ios' ? 'image/jpeg' : 'image/jpeg';
export const VIDEO_TYPE = Platform.OS === 'ios' ? 'video/mp4' : 'video/mp4';
