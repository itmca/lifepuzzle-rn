export const toMinuteSeconds = (seconds: number): string => {
  const intSeconds = Math.floor(seconds);
  const minutes = String(Math.floor(intSeconds / 60)).padStart(2, '0');
  const remainSeconds = String(intSeconds % 60).padStart(2, '0');

  return `${minutes}:${remainSeconds}`;
};
