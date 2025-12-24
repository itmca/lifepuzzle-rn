/**
 * Voice recording utility functions
 *
 * 음성 녹음 관련 유틸리티 함수들을 제공합니다.
 * - 파일명 생성
 * - 시간 포맷팅
 */

/**
 * 현재 시간 기반 녹음 파일명 생성
 *
 * @returns {string} 형식: YYYYMMDD_HHmmAM/PM (예: 20231215_1130PM)
 *
 * @example
 * const fileName = getRecordFileName();
 * // => "20231215_1130PM"
 */
export const getRecordFileName = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const minute = date.getMinutes();

  const tempHour = date.getHours();
  // Fixed hour calculation logic
  const hour = tempHour === 0 ? 12 : tempHour > 12 ? tempHour - 12 : tempHour;
  const hourUnit = tempHour < 12 ? 'AM' : 'PM';

  const fileName = `${year}${month}${day}_${hour}${minute}${hourUnit}`;
  return fileName;
};

/**
 * 밀리초를 HH:MM:SS 형식의 시간 문자열로 변환
 *
 * @param {number} milliSeconds - 밀리초 단위 시간
 * @returns {string} HH:MM:SS 형식 문자열
 *
 * @example
 * getDisplayRecordTime(125000);
 * // => "00:02:05"
 */
export const getDisplayRecordTime = (milliSeconds: number): string => {
  const seconds = Math.floor((milliSeconds / 1000) % 60);
  const minute = Math.floor((milliSeconds / 60000) % 60);
  const hour = Math.floor((milliSeconds / 3600000) % 60);

  const hourMinuteSeconds =
    hour.toLocaleString('en-US', { minimumIntegerDigits: 2 }) +
    ':' +
    minute.toLocaleString('en-US', { minimumIntegerDigits: 2 }) +
    ':' +
    seconds.toLocaleString('en-US', { minimumIntegerDigits: 2 });

  return hourMinuteSeconds;
};
