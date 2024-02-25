import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {UserType, RoleType} from './user.type';

export type HeroType = {
  heroNo: number;
  heroName: string;
  heroNickName: string;
  imageURL?: string;
  birthday?: Date;
  title?: string;
  modifiedImage?: PhotoIdentifier | undefined;
  linkedUser?: LinkedUserType[];
};
export type LinkedUserType = UserType & {
  role: RoleType;
};
export type ShareType = {
  heroNo: number;
  role: string;
  shareURL?: string;
};
export type CodeType = {
  code: string;
  name: string;
  description?: string;
};
