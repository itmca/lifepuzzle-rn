import {differenceInYears, format} from 'date-fns';

export const toMinuteSeconds = (seconds: number): string => {
  const intSeconds = Math.floor(seconds);
  const minutes = String(Math.floor(intSeconds / 60)).padStart(2, '0');
  const remainSeconds = String(intSeconds % 60).padStart(2, '0');

  return `${minutes}:${remainSeconds}`;
};

export const toHeroBirthdayAge = (date: Date): string => {
  const birthday = format(date, 'yyyy.MM.dd');
  const age = differenceInYears(new Date(), date);

  return `${birthday} (${age}살)`;
};
