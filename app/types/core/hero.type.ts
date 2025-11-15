import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {HeroAuthTypeCode} from '../../constants/auth.constant';

export type HeroType = {
  heroNo: number;
  heroName: string;
  heroNickName: string;
  imageURL?: string;
  birthday: Date;
  isLunar: boolean;
  title?: string;
  modifiedImage?: PhotoIdentifier | undefined;
  puzzleCnt?: number;
  auth?: HeroAuthTypeCode;
};

export type HeroUserType = {
  userNo: number;
  nickName: string;
  imageURL?: undefined | string;
  auth: HeroAuthTypeCode;
};

export type HeroWithPuzzleCntType = HeroType & {
  puzzleCount: number;
  users: HeroUserType[];
};
