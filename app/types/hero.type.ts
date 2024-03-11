import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import {AuthList} from '../constants/auth.constant';

export type HeroType = {
  heroNo: number;
  heroName: string;
  heroNickName: string;
  imageURL?: string;
  birthday?: Date;
  title?: string;
  modifiedImage?: PhotoIdentifier | undefined;
};

export type HeroUserType = {
  userNo: number;
  nickName?: string;
  imageURL?: undefined | string;
  auth?: AuthType;
};
export type AuthType = (typeof AuthList)[number]['code'];

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
