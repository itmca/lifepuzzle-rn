import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {RoleList} from '../constants/role.constant';

export type UserType = {
  userNo: number;
  userId: string;
  userNickName: string;
  recentHeroNo: number;
  imageURL: undefined | string;
  userType: 'general' | 'kakao' | 'apple' | 'none';
  modifiedImage?: PhotoIdentifier | undefined;
};
export type RoleType = (typeof RoleList)[number]['code'];
