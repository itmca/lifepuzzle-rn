import { PhotoIdentifier } from '@react-native-camera-roll/camera-roll';
import { HeroAuthTypeCode } from '../../constants/auth.constant';

// 조회용 Hero 타입
export type HeroType = {
  heroNo: number;
  heroName: string;
  heroNickName: string;
  imageUrl?: string; // 네이밍 일관성: imageURL → imageUrl
  birthday: Date;
  isLunar?: boolean; // optional로 변경 (일관성)
  title?: string;
  modifiedImage?: PhotoIdentifier;
  puzzleCnt?: number;
  auth?: HeroAuthTypeCode;
};

// 편집용 Hero 타입 (통합)
export type WritingHeroType = {
  heroNo?: number;
  heroName?: string;
  heroNickName?: string;
  birthday?: Date;
  isLunar?: boolean;
  title?: string;
  imageUrl?: string; // 네이밍 일관성
  modifiedImage?: PhotoIdentifier;
  isProfileImageUpdate?: boolean;
};

// Hero와 연관된 사용자 타입
export type HeroUserType = {
  userNo: number;
  nickName: string;
  imageUrl?: string; // 네이밍 일관성
  auth: HeroAuthTypeCode;
};

// 퍼즐 수가 포함된 Hero 타입
export type HeroWithPuzzleCntType = HeroType & {
  puzzleCount: number;
  users: HeroUserType[];
};

// 사진 조회용 Hero 타입 (API 응답용)
export type PhotoHeroType = {
  id: number;
  name: string;
  nickname: string;
  birthdate: string;
  age: number;
  image: string;
};
