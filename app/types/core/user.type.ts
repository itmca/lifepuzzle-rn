import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';

export type UserType = {
  userNo: number;
  userId: string;
  userNickName: string;
  recentHeroNo: number;
  imageUrl?: string;  // 네이밍 일관성: imageURL → imageUrl, undefined | string → string | undefined
  userType: 'general' | 'kakao' | 'apple' | 'none';
  modifiedImage?: PhotoIdentifier;
  isProfileImageUpdate: boolean;
};
