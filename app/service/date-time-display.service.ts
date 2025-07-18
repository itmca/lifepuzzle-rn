export const toMmSs = (seconds: number): string => {
  const intSeconds = Math.floor(seconds);
  const minutes = String(Math.floor(intSeconds / 60)).padStart(2, '0');
  const remainSeconds = String(intSeconds % 60).padStart(2, '0');

  return `${minutes}:${remainSeconds}`;
};
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
export const toInternationalAge = (birthDate: Date): number => {
  const birthYear = birthDate.getFullYear();
  const birthMonth = birthDate.getMonth();
  const birthDay = birthDate.getDate();

  const now = new Date();
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
