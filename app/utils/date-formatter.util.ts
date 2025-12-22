/**
 * 날짜 포맷팅 유틸리티
 */

/**
 * 현재 날짜와 시간을 YYYYMMDDhhmmss 형식으로 변환
 * @returns YYYYMMDDhhmmss 형식 문자열
 * @example getFormattedDateTime() // "20250608143025"
 */
export const getFormattedDateTime = (now: Date = new Date()): string => {
  const yyyy = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${yyyy}${MM}${dd}${hh}${mm}${ss}`;
};

/**
 * 날짜를 "오늘" 또는 "YY/MM/DD" 형식으로 변환
 * @param date 변환할 날짜 (Date 객체 또는 문자열)
 * @returns 오늘이면 "오늘 HH:mm", 아니면 "YY/MM/DD HH:mm"
 * @example formatDateToTodayOrYYMMDD(new Date()) // "오늘 14:30"
 * @example formatDateToTodayOrYYMMDD("2025-05-01") // "25/05/01 10:00"
 */
export const formatDateToTodayOrYYMMDD = (
  date: Date | string,
  now: Date = new Date(),
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // 오늘 날짜인지 확인
  const isToday =
    dateObj.getFullYear() === now.getFullYear() &&
    dateObj.getMonth() === now.getMonth() &&
    dateObj.getDate() === now.getDate();

  if (isToday) {
    const hh = String(dateObj.getHours()).padStart(2, '0');
    const mm = String(dateObj.getMinutes()).padStart(2, '0');
    return `오늘 ${hh}:${mm}`;
  } else {
    const yy = String(dateObj.getFullYear()).slice(-2);
    const MM = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const hh = String(dateObj.getHours()).padStart(2, '0');
    const mm = String(dateObj.getMinutes()).padStart(2, '0');
    return `${yy}/${MM}/${dd} ${hh}:${mm}`;
  }
};

/**
 * 날짜를 "YYYY.MM.DD (요일)" 형식으로 변환
 * @param date 변환할 날짜 (Date 객체 또는 undefined)
 * @returns 날짜가 없으면 빈 문자열, 있으면 "YYYY.MM.DD (요일)" 형식
 * @example formatDateWithDay(new Date('2025-06-08')) // "2025.06.08 (일)"
 * @example formatDateWithDay(undefined) // ""
 */
export const formatDateWithDay = (date?: Date): string => {
  if (!date) {
    return '';
  }
  const daysKor = ['일', '월', '화', '수', '목', '금', '토'];
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const day = daysKor[date.getDay()];
  return `${year}.${month}.${dd} (${day})`;
};
