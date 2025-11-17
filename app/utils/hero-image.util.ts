import { PhotoIdentifier } from '@react-native-camera-roll/camera-roll';
import { WritingHeroType } from '../types/core/hero.type';

/**
 * WritingHero에서 이미지 URI를 안전하게 가져오는 유틸리티 함수
 *
 * @param writingHero WritingHero 객체
 * @returns 이미지 URI 또는 undefined
 */
export const getHeroImageUri = (
  writingHero?: WritingHeroType,
): string | undefined => {
  if (!writingHero) return undefined;

  // 1. modifiedImage가 있으면 (디바이스에서 선택한 이미지) 우선 사용
  if (writingHero.modifiedImage?.node?.image?.uri) {
    return writingHero.modifiedImage.node.image.uri;
  }

  // 2. imageUrl이 문자열이면 (API에서 온 이미지) 사용
  if (typeof writingHero.imageUrl === 'string') {
    return writingHero.imageUrl;
  }

  // 3. imageUrl이 PhotoIdentifier 객체인 경우 (레거시 지원)
  if (
    writingHero.imageUrl &&
    typeof writingHero.imageUrl === 'object' &&
    'node' in writingHero.imageUrl
  ) {
    return (writingHero.imageUrl as PhotoIdentifier).node?.image?.uri;
  }

  return undefined;
};

/**
 * WritingHero가 이미지를 가지고 있는지 확인
 */
export const hasHeroImage = (writingHero?: WritingHeroType): boolean => {
  return getHeroImageUri(writingHero) !== undefined;
};

/**
 * WritingHero의 이미지가 수정된 이미지인지 확인 (디바이스에서 선택한 새 이미지)
 */
export const isModifiedImage = (writingHero?: WritingHeroType): boolean => {
  return writingHero?.modifiedImage?.node?.image?.uri !== undefined;
};
