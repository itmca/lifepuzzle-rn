import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';

export type WritingHeroType = {
  heroNo?: number;
  heroName: string;
  heroNickName: string;
  birthday?: Date;
  isLunar?: boolean;
  title?: string;
  imageURL?: PhotoIdentifier;
  isProfileImageUpdate?: boolean;
};
