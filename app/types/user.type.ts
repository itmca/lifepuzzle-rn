import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';

export type UserType = {
  userNo: number;
  userId: string;
  userNickName: string;
  recentHeroNo: number;
  imageURL: undefined | string;
  userType: 'general' | 'kakao' | 'apple' | 'none';
  modifiedImage?: PhotoIdentifier | undefined;
};
