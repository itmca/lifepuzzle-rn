/**
 * 나이 계산 유틸리티
 */

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
