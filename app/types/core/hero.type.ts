import { PhotoIdentifier } from '@react-native-camera-roll/camera-roll';
import { HeroAuthTypeCode } from '../../constants/auth.constant';

// 조회용 Hero 타입
export type HeroType = {
  id: number;
  name: string;
  nickName: string;
  imageUrl?: string; // 네이밍 일관성: imageURL → imageUrl
  birthday: Date;
  isLunar?: boolean; // optional로 변경 (일관성)
  modifiedImage?: PhotoIdentifier;
  puzzleCnt?: number;
  auth?: HeroAuthTypeCode;
};

// 편집용 Hero 타입 (통합)
export type WritingHeroType = {
  id?: number;
  name?: string;
  nickName?: string;
  birthday?: Date;
  isLunar?: boolean;
  imageUrl?: string; // 네이밍 일관성
  modifiedImage?: PhotoIdentifier;
  profileImageUpdate?: boolean;
};

// Hero와 연관된 사용자 타입
export type HeroUserType = {
  id: number;
  nickName: string;
  imageUrl?: string; // 네이밍 일관성
  auth: HeroAuthTypeCode;
};

// 퍼즐 수가 포함된 Hero 타입
export type HeroWithPuzzleCntType = HeroType & {
  puzzleCount: number;
  users: HeroUserType[];
};
