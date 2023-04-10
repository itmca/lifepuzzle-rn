import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';

export type HeroType = {
  heroNo: number;
  heroName: string;
  heroNickName: string;
  imageURL?: string;
  birthday?: Date;
  title?: string;
  modifiedImage?: PhotoIdentifier | undefined;
};
