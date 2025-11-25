import { PhotoIdentifier } from '@react-native-camera-roll/camera-roll';

export type UserType = {
  id: number;
  loginId: string;
  nickName: string;
  recentHeroNo: number;
  imageUrl?: string; // 네이밍 일관성: imageURL → imageUrl, undefined | string → string | undefined
  userType: 'general' | 'kakao' | 'apple' | 'none';
  modifiedImage?: PhotoIdentifier;
  isProfileImageUpdate: boolean;
};
