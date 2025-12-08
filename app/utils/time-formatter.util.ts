/**
 * 시간 포맷팅 유틸리티
 */

/**
 * 초를 MM:SS 형식으로 변환
 * @param seconds 초 단위 시간
 * @returns MM:SS 형식 문자열
 * @example toMmSs(125) // "02:05"
 */
export const toMmSs = (seconds: number): string => {
  const intSeconds = Math.floor(seconds);
  const minutes = String(Math.floor(intSeconds / 60)).padStart(2, '0');
  const remainSeconds = String(intSeconds % 60).padStart(2, '0');

  return `${minutes}:${remainSeconds}`;
};

/**
 * 초를 MM:SS:SS 형식으로 변환 (밀리초 포함)
 * @param seconds 초 단위 시간 (소수점 포함)
 * @returns MM:SS:SS 형식 문자열
 * @example toMmSsSS(125.45) // "02:05:45"
 */
export const toMmSsSS = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const millis = Math.floor((seconds % 1) * 100); // 소수점 이하 2자리

  return (
    `${String(mins).padStart(2, '0')}:` +
    `${String(secs).padStart(2, '0')}:` +
    `${String(millis).padStart(2, '0')}`
  );
};
