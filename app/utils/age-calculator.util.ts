/**
 * 나이 계산 유틸리티
 */

import { AgeType, TagKey } from '../types/core/media.type';

/**
 * 생년월일로 만 나이 계산
 * @param birthDate 생년월일
 * @param now 기준 날짜 (기본값: 현재 날짜)
 * @returns 만 나이
 * @example toInternationalAge(new Date(2000, 5, 15)) // 24 (2025년 기준, 생일 전이면 23)
 */
export const toInternationalAge = (
  birthDate: Date,
  now: Date = new Date(),
): number => {
  const birthYear = birthDate.getFullYear();
  const birthMonth = birthDate.getMonth();
  const birthDay = birthDate.getDate();

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();

  let age = currentYear - birthYear;

  // 생일이 아직 안 지났으면 나이 -1
  if (
    currentMonth < birthMonth ||
    (currentMonth === birthMonth && currentDay < birthDay)
  ) {
    age--;
  }

  return age;
};

/**
 * 만 나이를 나이대(AgeType)로 변환
 * @param age 만 나이
 * @returns 나이대 TagKey
 * @example ageToAgeGroup(25) // 'TWENTIES'
 */
export const ageToAgeGroup = (age: number): AgeType => {
  if (age < 0) return 'UNCATEGORIZED';
  if (age < 10) return 'UNDER_TEENAGER';
  if (age < 20) return 'TEENAGER';
  if (age < 30) return 'TWENTIES';
  if (age < 40) return 'THIRTY';
  if (age < 50) return 'FORTY';
  if (age < 60) return 'FIFTY';
  if (age < 70) return 'SIXTY';
  if (age < 80) return 'SEVENTY';
  if (age < 90) return 'EIGHTY';
  if (age < 100) return 'NINETY';
  return 'UPPER_NINETY';
};

/**
 * 생년월일과 기준 날짜로 나이대 계산
 * @param birthDate 생년월일
 * @param targetDate 기준 날짜
 * @returns 나이대 TagKey
 * @example calculateAgeGroupFromDate(new Date(2000, 0, 1), new Date(2025, 0, 1)) // 'TWENTIES'
 */
export const calculateAgeGroupFromDate = (
  birthDate: Date,
  targetDate: Date,
): AgeType => {
  const age = toInternationalAge(birthDate, targetDate);
  return ageToAgeGroup(age);
};

/**
 * 나이대의 나이 범위 가져오기
 * @param ageGroup 나이대
 * @returns 나이 범위 { min, max }
 */
export const getAgeRangeFromAgeGroup = (
  ageGroup: AgeType,
): { min: number; max: number } => {
  switch (ageGroup) {
    case 'UNDER_TEENAGER':
      return { min: 0, max: 9 };
    case 'TEENAGER':
      return { min: 10, max: 19 };
    case 'TWENTIES':
      return { min: 20, max: 29 };
    case 'THIRTY':
      return { min: 30, max: 39 };
    case 'FORTY':
      return { min: 40, max: 49 };
    case 'FIFTY':
      return { min: 50, max: 59 };
    case 'SIXTY':
      return { min: 60, max: 69 };
    case 'SEVENTY':
      return { min: 70, max: 79 };
    case 'EIGHTY':
      return { min: 80, max: 89 };
    case 'NINETY':
      return { min: 90, max: 99 };
    case 'UPPER_NINETY':
      return { min: 100, max: 999 };
    case 'UNCATEGORIZED':
    default:
      return { min: -999, max: 999 };
  }
};

/**
 * 날짜가 특정 나이대 범위에 속하는지 검증
 * @param birthDate 생년월일
 * @param targetDate 검증할 날짜
 * @param ageGroup 나이대
 * @returns 유효 여부
 */
export const isDateInAgeGroup = (
  birthDate: Date,
  targetDate: Date,
  ageGroup: AgeType,
): boolean => {
  if (ageGroup === 'UNCATEGORIZED') {
    return true;
  }

  const age = toInternationalAge(birthDate, targetDate);
  const { min, max } = getAgeRangeFromAgeGroup(ageGroup);
  return age >= min && age <= max;
};
