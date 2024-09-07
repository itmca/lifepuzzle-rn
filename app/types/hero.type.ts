import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {HeroAuthTypeCode} from '../constants/auth.constant.ts';

export type HeroType = {
  heroNo: number;
  heroName: string;
  heroNickName: string;
  imageURL?: string;
  birthday?: Date;
  title?: string;
  modifiedImage?: PhotoIdentifier | undefined;
  puzzleCnt?: number;
};

export type HeroUserType = {
  userNo: number;
  nickName?: string;
  imageURL?: undefined | string;
  auth: HeroAuthTypeCode;
};

export const toPhotoIdentifier = (uri: string) => ({
  node: {
    type: '',
    subTypes: undefined,
    group_name: '',
    image: {
      filename: uri ? uri.split('/').pop() : '',
      filepath: null,
      extension: null,
      uri: uri,
      height: 0,
      width: 0,
      fileSize: null,
      playableDuration: 0,
      orientation: null,
    },
    timestamp: 0,
    modificationTimestamp: 0,
    location: null,
  },
});

export type HeroWithPuzzleCntType = HeroType & {
  puzzleCount: number;
  users: HeroUserType[];
};
